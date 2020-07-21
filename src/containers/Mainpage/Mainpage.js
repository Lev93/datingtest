/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import Promo from '../../components/Promo/Promo';
import Welcome from '../../components/Welcome/Welcome';
import Mobile from '../../components/Mobile/Mobile';
import MainFindSoulMate from '../../components/MainFindSoulMate/MainFindSoulMate';
import MainPageBlog from '../../components/MainPageBlog/MainPageBlog';
import LatestRegisteredMembers from '../../components/LatestRegisteredMembers/LatestRegisteredMembers';
import MainMap from '../MainMap/MainMap';
import * as actions from '../../actions';

class MainPage extends Component {
  state = {
    isLoaded: false,
    slider: 1,
    welcomeinfo: {
      totalMembers: 1600,
      membersOnline: 500,
      menOnline: 300,
      womenOnline: 200,
    },
    reviews: [{ text: 'MainPage.reviews.1', author: 'Amanda Davidson', rating: 5 },
      { text: 'MainPage.reviews.2', author: 'David Kim', rating: 4 },
      { text: 'MainPage.reviews.3', author: 'Arnold Hammil', rating: 5 }],
    blogs: [],
    lastRegisteredUsers: [],
    users: [],
    center: {
      lat: this.props.coordinates.lat,
      lng: this.props.coordinates.lng,
    },
  }

  componentDidMount() {
    this.startCarousel();
    if (!this.props.user.isAuth) {
      const success = (pos) => {
        this.props.changeCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      };
      const error = () => {
        if (localStorage.getItem('i18nextLng') === 'ru') {
          this.props.changeCoordinates({ lat: 55.7522200, lng: 37.6155600 });
        } else if (localStorage.getItem('i18nextLng') === 'ukr') {
          this.props.changeCoordinates({ lat: 50.4546600, lng: 30.5238000 });
        } else {
          this.props.changeCoordinates({ lat: 51.5085300, lng: -0.1257400 });
        }
      };
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
    const data = {
      userId: localStorage.getItem('userId'),
      lng: this.props.coordinates.lng,
      lat: this.props.coordinates.lat,
      language: this.props.lng.short,
    };
    axios({
      method: 'post',
      url: '/main/',
      data: qs.stringify(data),
    }).then((res) => {
      const menonline = res.data.info.find((el) => el.online === 1 && el.gender === 'male') || { totalmembers: 0 };
      const womenonline = res.data.info.find((el) => el.online === 1 && el.gender === 'female') || { totalmembers: 0 };
      const totalMembers = res.data.info.reduce((acc, val) => acc + val.totalmembers, 0);
      const welcomeinfo = {
        menOnline: menonline.totalmembers,
        womenOnline: womenonline.totalmembers,
        membersOnline: menonline.totalmembers + womenonline.totalmembers,
        totalMembers,
      };
      this.setState({
        welcomeinfo,
        blogs: res.data.blogs,
        lastRegisteredUsers: res.data.lastRegisteredUsers,
        isLoaded: true,
        users: res.data.users,
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.coordinates.lat !== prevProps.coordinates.lat) {
      const data = {
        userId: localStorage.getItem('userId'),
        lng: this.props.coordinates.lng,
        lat: this.props.coordinates.lat,
      };
      axios({
        method: 'post',
        url: '/main/map',
        data: qs.stringify(data),
      }).then((res) => {
        this.setState({
          center: this.props.coordinates,
          users: res.data.users,
          isLoaded: true,
        });
      }).catch((err) => {
        this.props.addError(err.response.data.message);
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.carouselInterval);
  }

  startCarousel = () => {
    this.carouselInterval = setInterval(() => {
      this.setState((prevState) => {
        return { slider: prevState.slider === 1 ? 2 : 1 };
      });
    }, 5000);
  };

  render() {
    const mainPage = (<React.Fragment>
      <Promo slider = {this.state.slider}/>
      <Welcome welcomeinfo={this.state.welcomeinfo}/>
      <Mobile reviews={this.state.reviews}/>
      <MainFindSoulMate/>
      <MainPageBlog blogs={this.state.blogs}/>
      <LatestRegisteredMembers users={this.state.lastRegisteredUsers} />
      <MainMap users={this.state.users} sidePanel={true}
        center={{ lat: this.state.center.lat, lng: this.state.center.lng }}/>
    </React.Fragment >);
    return this.state.isLoaded ? mainPage : null;
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
  changeCoordinates: actions.changeCoordinates,
  addError: actions.addError,
};

MainPage.propTypes = {
  user: PropTypes.shape({
    isAuth: PropTypes.bool,
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  coordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  changeCoordinates: PropTypes.func,
  addError: PropTypes.func,
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
};

export default connect(mapStateToProps, actionCreators)(MainPage);
