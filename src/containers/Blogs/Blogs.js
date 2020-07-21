/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';
import CommunityTitle from '../../components/CommunityTitle/CommunityTitle';
import AllBlogs from '../../components/AllBlogs/Allblogs';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import * as actions from '../../actions';

class Blogs extends Component {
  state = {
    isLoaded: false,
    blogs: [],
    activeType: 'all',
    page: 1,
    sortType: 'date',
    sortDirections: 'ASC',
  }

  componentDidMount() {
    const { short } = this.props.lng;
    const dataSort = `${this.state.sortType} ${this.state.sortDirections}`;
    const data = {
      lng: short,
      activeType: this.state.activeType,
      page: this.state.page,
      sort: dataSort,
    };
    axios({
      method: 'post',
      url: '/blogs/',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      const { blogs } = res.data;
      this.setState({
        blogs: this.textShorter(blogs),
        isLoaded: true,
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  textShorter = (blogs) => {
    const updatedBlogs = [...blogs];
    for (let i = 0; i < updatedBlogs.length; i += 1) {
      let text = '';
      const blocks = htmlToDraft(updatedBlogs[i].text);
      for (let j = 0; i < blocks.contentBlocks.length; j += 1) {
        if (blocks.contentBlocks[j].text.length > 20) {
          text = blocks.contentBlocks[j].text;
          break;
        }
      }
      if (text.length > 200) {
        text = text.slice(0, 200).concat('...');
      }
      updatedBlogs[i].text = text;
    }
    return updatedBlogs;
  }

  changeActiveType = (activeType) => () => {
    const { short } = this.props.lng;
    const dataSort = `${this.state.sortType} ${this.state.sortDirections}`;
    const data = {
      lng: short,
      page: 1,
      sort: dataSort,
      activeType,
    };
    axios({
      method: 'post',
      url: '/blogs/',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      const { blogs } = res.data;
      this.setState({
        page: 1,
        sortType: 'date',
        sortDirections: 'ASC',
        activeType,
        blogs: this.textShorter(blogs),
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  sortHandler = (sort) => () => {
    const { short } = this.props.lng;
    let dataSort = '';
    let direction = 'ASC';
    if (this.state.sortType === sort) {
      if (this.state.sortDirections === 'ASC') {
        direction = 'DESC';
      }
      dataSort = `${this.state.sortType} ${direction}`;
    } else {
      dataSort = `${sort} ${direction}`;
    }

    const data = {
      lng: short,
      page: 1,
      sort: dataSort,
      activeType: this.state.activeType,
    };
    axios({
      method: 'post',
      url: '/blogs/',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      const { blogs } = res.data;
      this.setState({
        page: 1,
        sortType: sort,
        sortDirections: direction,
        blogs: this.textShorter(blogs),
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  nextPage = (next) => () => {
    const { short } = this.props.lng;
    let dataSort = '';
    dataSort = `${this.state.sortType} ${this.state.sortDirections}`;
    const newPage = next === 'next' ? this.state.page + 1 : this.state.page - 1;
    const data = {
      lng: short,
      page: newPage,
      sort: dataSort,
      activeType: this.state.activeType,
    };
    axios({
      method: 'post',
      url: '/blogs/',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      const { blogs } = res.data;
      this.setState({
        page: newPage,
        blogs: this.textShorter(blogs),
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }


  render() {
    const mainPage = (<React.Fragment>
      <CommunityTitle title={'blogs.title'} subTittle={'blogs.mainTitle'} />
      <AllBlogs
        blogs={this.state.blogs}
        activeType={this.state.activeType}
        page={this.state.page}
        sortHandler={this.sortHandler}
        sortType={this.state.sortType}
        sortDirections={this.state.sortDirections}
        changeActiveType={this.changeActiveType}
        nextPage={this.nextPage}
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

Blogs.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  addError: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, actionCreators)(Blogs));
