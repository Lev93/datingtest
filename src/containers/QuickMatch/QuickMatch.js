/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { Trans } from 'react-i18next';
import CommunityTitle from '../../components/CommunityTitle/CommunityTitle';
import ProfileAbout from '../ProfileAbout/ProfileAbout';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import QuickMatchUsers from '../../components/QuickMatchUsers/QuickMatchUsers';
import QuickMatchUserPhotos from '../../components/QuickMatchUserPhotos/QuickMatchUserPhotos';
import * as actions from '../../actions';

const formatDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;
  const yy = date.getFullYear();
  return `${yy}-${mm}-${dd}`;
};

class MainPage extends Component {
  state = {
    isLoaded: false,
    activeUser: { },
    activeMenu: 'main',
    users: [],
    renderPhotos: false,
  }

  componentDidMount() {
    const {
      userId,
      city,
      country,
      lookingfora,
      lookingforageless,
      lookingforagemore,
    } = this.props.user;
    const birthadayfrom = new Date(Date.now());
    const birthadayto = new Date(Date.now());
    birthadayfrom.setFullYear(birthadayfrom.getFullYear() - lookingforagemore);
    birthadayto.setFullYear(birthadayto.getFullYear() - lookingforageless);
    const from = formatDate(birthadayfrom);
    const to = formatDate(birthadayto);
    const { lat, lng } = this.props.coordinates;
    const language = this.props.lng.short;
    const data = {
      userId,
      city,
      country,
      lat,
      lng,
      lookingfora,
      from,
      to,
      language,
    };
    axios({
      method: 'post',
      url: '/community/quickmatch',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      if (res.data.noUsers) {
        this.setState({ isLoaded: true, users: [] });
      } else {
        this.setState({
          users: res.data.users,
          activeUser: res.data.users[0],
          isLoaded: true,
          renderPhotos: true,
        });
      }
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeUser.photos) {
      if (this.state.activeUser.photos[0] !== prevState.activeUser.photos[0]) {
        this.setState({ renderPhotos: true });
      }
    }
  }

  menuClick = (menuItem) => () => {
    this.setState({ activeMenu: menuItem });
  }

  userClick = (userId) => {
    if (userId === this.state.activeUser.id) return;
    this.setState((prevState) => {
      const newActiveUserIndex = prevState.users.findIndex((user) => user.id === userId);
      const newUsers = [...prevState.users];
      const newActiveUser = newUsers[newActiveUserIndex];
      newUsers.splice(newActiveUserIndex, 1);
      newUsers.unshift(newActiveUser);
      return {
        activeUser: prevState.users[newActiveUserIndex],
        users: newUsers,
        renderPhotos: false,
      };
    });
  }

  likeClick = (type) => {
    const newUsers = [...this.state.users];
    newUsers.shift();
    if (newUsers.length === 0) {
      this.setState({ users: [] });
    } else {
      this.setState({ users: newUsers, activeUser: newUsers[0], renderPhotos: false });
    }
    const {
      userId,
      city,
      country,
      lookingfora,
      lookingforageless,
      lookingforagemore,
    } = this.props.user;
    const birthadayfrom = new Date(Date.now());
    const birthadayto = new Date(Date.now());
    birthadayfrom.setFullYear(birthadayfrom.getFullYear() - lookingforagemore);
    birthadayto.setFullYear(birthadayto.getFullYear() - lookingforageless);
    const from = formatDate(birthadayfrom);
    const to = formatDate(birthadayto);
    const { lat, lng } = this.props.coordinates;
    const language = this.props.lng.short;
    const data = {
      userId,
      city,
      country,
      lat,
      lng,
      lookingfora,
      from,
      to,
      language,
      secondUser: this.state.activeUser.id,
      type,
      usersLength: this.state.users.length,
    };
    axios({
      method: 'post',
      url: '/community/quickmatchnext',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      if (res.data.newUser !== '') {
        newUsers.push(res.data.newUser);
        this.setState({
          users: newUsers,
        });
      }
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  render() {
    const mainPage = (<React.Fragment>
      <CommunityTitle title={'quickMatch.title'} subTittle={'quickMatch.mainTitle'} />
      {this.state.users.length < 1
        ? <section className="error404">
        <h6 className="error404__title"><Trans>quickMatch.error</Trans></h6>
        <h5 className="error404__bottom"><Trans>quickMatch.noUsers</Trans></h5>
        <Link exact to="/" className="error404__link"><Trans>error.goToHomePage</Trans></Link>
      </section>
        : <React.Fragment>
      <QuickMatchUsers users = {this.state.users} userClick = {this.userClick}/>
        {this.state.renderPhotos || this.state.activeUser.photos.length === 0
          ? <QuickMatchUserPhotos activeUser = {this.state.activeUser} likeClick={this.likeClick}/>
          : null}
      <ProfileAbout
        user={this.state.activeUser}
        activeMenu={this.state.activeMenu}
        menuClick={this.menuClick}
        photoClick={this.photoClick}
        photoOpened={this.state.photoOpened}
        photoClose={this.photoClose}
        photoIndex={this.state.photoIndex}
        posts={this.state.posts}
        profile={false}
        match={true}
        />
        </React.Fragment >
      }
    </React.Fragment >);
    return this.state.isLoaded ? mainPage : <LoadingScreen />;
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    lng: state.lng,
    coordinates: state.coordinates,
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
    city: PropTypes.string,
    country: PropTypes.number,
    lookingfora: PropTypes.string,
    lookingforageless: PropTypes.number,
    lookingforagemore: PropTypes.number,
  }),
  coordinates: PropTypes.shape(),
  addError: PropTypes.func,
  addChatParameters: PropTypes.func,
  history: PropTypes.shape(),
};

export default withRouter(connect(mapStateToProps, actionCreators)(MainPage));
