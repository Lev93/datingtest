/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import UserProfileTop from '../../components/UserProfileTop/UserProfileTop';
import ProfileAbout from '../ProfileAbout/ProfileAbout';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import * as actions from '../../actions';

class MainPage extends Component {
  state = {
    isLoaded: false,
    user: {},
    activeMenu: 'main',
    photoOpened: false,
    photoIndex: 0,
    posts: [],
  }

  componentDidMount() {
    const userId = this.props.match.params.id;
    const { short } = this.props.lng;
    const data = { userId, lng: short };
    axios({
      method: 'post',
      url: '/community/user',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      this.setState({
        user: res.data.user,
        isLoaded: true,
        posts: res.data.user.blogs,
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

  openChat = () => {
    this.props.addChatParameters(this.props.match.params.id);
    this.props.history.push('/messages');
  }

  render() {
    const mainPage = (<React.Fragment>
      <UserProfileTop
        user={this.state.user}
        openChat={this.openChat}
        profile={false}
        isAuth={this.props.user.isAuth}
      />
      <ProfileAbout
        user={this.state.user}
        activeMenu={this.state.activeMenu}
        menuClick={this.menuClick}
        photoClick={this.photoClick}
        photoOpened={this.state.photoOpened}
        photoClose={this.photoClose}
        photoIndex={this.state.photoIndex}
        posts={this.state.posts}
        profile={false}
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
  addChatParameters: actions.addChatParameters,
};

MainPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
    isAuth: PropTypes.bool,
  }),
  addError: PropTypes.func,
  addChatParameters: PropTypes.func,
  history: PropTypes.shape(),
};

export default withRouter(connect(mapStateToProps, actionCreators)(MainPage));
