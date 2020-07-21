/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import CommunityTitle from '../../components/CommunityTitle/CommunityTitle';
import TextEditor from '../TextEditor/TextEditor';
import * as actions from '../../actions';

class Blogs extends Component {
  state = {
    category: 'dating',
    title: '',
    image: '',
  }

  submitBlog = (html) => {
    const data = {
      userId: this.props.user.userId,
      html,
      image: this.state.image,
      title: this.state.title,
      category: this.state.category,
      lng: this.props.lng.short,
    };
    axios({
      method: 'post',
      url: '/blogs/create',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      if (res.data.message === 'success') {
        this.props.history.push('/blogs');
      }
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  changeCategory = (e) => {
    this.setState({ category: e.target.value });
  }

  changeTitle = (e) => {
    this.setState({ title: e.target.value });
  }

  changeImage = (image) => {
    if (this.state.image === '') {
      this.setState({ image });
    }
  }

  render() {
    return <React.Fragment>
    <CommunityTitle title={'blogCreate.title'} subTittle={'blogCreate.mainTitle'} />
    <TextEditor
      submitBlog={this.submitBlog}
      category={this.state.category}
      changeCategory={this.changeCategory}
      title={this.state.title}
      changeTitle={this.changeTitle}
      changeImage={this.changeImage}
    />
  </React.Fragment >;
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

Blogs.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  addError: PropTypes.func,
  history: PropTypes.shape(),
};

export default withRouter(connect(mapStateToProps, actionCreators)(Blogs));
