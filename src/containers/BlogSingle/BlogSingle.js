/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import CommunityTitle from '../../components/CommunityTitle/CommunityTitle';
import Blog from '../../components/Blog/Blog';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import * as actions from '../../actions';

class BlogSingle extends Component {
  state = {
    isLoaded: false,
    blog: {},
    newComment: '',
  }

  componentDidMount() {
    const postId = this.props.match.params.id;
    const data = { postId };
    axios({
      method: 'post',
      url: '/blogs/getblog',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      this.setState({
        blog: res.data.blog,
        isLoaded: true,
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  inputHandle = (e) => {
    this.setState({ newComment: e.target.value });
  }

  leaveComment = (e) => {
    e.preventDefault();
    const postId = this.props.match.params.id;
    const data = { postId, userId: this.props.user.userId, text: this.state.newComment };
    axios({
      method: 'post',
      url: '/blogs/newcomment',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      const newBlog = this.state.blog;
      newBlog.commentsList.push(res.data.comment);
      newBlog.comments += newBlog.comments;
      this.setState({
        blog: newBlog,
        newComment: '',
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  like = (e) => {
    e.preventDefault();
    const postId = this.props.match.params.id;
    const data = { postId, userId: this.props.user.userId };
    axios({
      method: 'post',
      url: '/blogs/like',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      if (res.data.message === 'success') {
        const newBlog = this.state.blog;
        newBlog.likes += 1;
        this.setState({
          blog: newBlog,
        });
      }
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  render() {
    const mainPage = (<React.Fragment>
      <CommunityTitle title={'blog.title'} subTittle={'blog.mainTitle'} />
      <Blog
        blog={this.state.blog}
        newComment={this.state.newComment}
        leaveComment={this.leaveComment}
        inputHandle={this.inputHandle}
        like={this.like}
      />
    </React.Fragment >);
    return this.state.isLoaded ? mainPage : <LoadingScreen />;
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    lng: state.lng,
  };
  return props;
};

const actionCreators = {
  addError: actions.addError,
};

BlogSingle.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  addError: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, actionCreators)(BlogSingle));
