/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import ProfileContainer from '../ProfileContainer/ProfileContainer';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import * as actions from '../../actions';

class Profile extends Component {
  state = {
    isLoaded: false,
    blogs: [],
    user: {},
    activeMenu: 'main',
    photoOpened: false,
    photoIndex: 0,
    posts: [],
  }

  componentDidMount() {
    const { userId } = this.props.user;
    const { short } = this.props.lng;
    const data = { userId, lng: short };
    axios({
      method: 'post',
      url: '/profile/',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      const { user } = res.data;
      user.token = this.props.user.token;
      this.setState({
        user,
        isLoaded: true,
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  menuClick = (menuItem) => () => {
    this.setState({ activeMenu: menuItem });
  }

  photoClick = (i) => () => {
    this.setState({ photoOpened: true, photoIndex: i });
  }

  photoClose = (event) => {
    event.preventDefault();
    this.setState({ photoOpened: false, photoIndex: 0 });
  }

  render() {
    const mainPage = (<React.Fragment>
      <ProfileContainer
        user={this.state.user}
        activeMenu={this.state.activeMenu}
        menuClick={this.menuClick}
        photoClick={this.photoClick}
        photoOpened={this.state.photoOpened}
        photoClose={this.photoClose}
        photoIndex={this.state.photoIndex}
        posts={this.state.posts}
        lng={this.props.lng.short}
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

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  addError: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, actionCreators)(Profile));
