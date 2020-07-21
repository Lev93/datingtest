/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProfileAbout from '../ProfileAbout/ProfileAbout';
import UserProfileTop from '../../components/UserProfileTop/UserProfileTop';
import * as actions from '../../actions';

class ProfileContainer extends Component {
  state = {
    user: this.props.user,
    menuitems: {
      gender: false,
      age: false,
      countries: false,
      birthday: false,
    },
    search: {
      countries: {
        results: [],
        value: '',
      },
    },
    text: {
      city: this.props.user.city,
      height: this.props.user.height,
      weight: this.props.user.weight,
      birthday: this.props.user.birthday,
    },
    textarea: {
      aboutme: this.props.user.aboutme || '',
      lookingfor: this.props.user.lookingfor || '',
    },
  }

  clickHandler = (menuitem) => (e) => {
    e.preventDefault();
    const oldMenuitems = { ...this.state.menuitems };
    oldMenuitems[menuitem] = !oldMenuitems[menuitem];
    this.setState({ menuitems: oldMenuitems });
  }

  optionClickHandler = (item, option) => (e) => {
    e.preventDefault();
    const oldUser = { ...this.state.user };
    const oldMenuitems = { ...this.state.menuitems };
    const data = { item, option, userId: this.props.user.id };
    axios({
      method: 'post',
      url: 'profile/update',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then(() => {
      oldUser[item] = option;
      oldMenuitems[item] = !oldMenuitems[item];
      this.setState({ user: oldUser, menuitems: oldMenuitems });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  optionManyClickHandler = (item, option) => (e) => {
    e.preventDefault();
    const oldUser = { ...this.state.user };
    let options;
    if (oldUser[item].includes(option)) {
      const newArray = oldUser[item].filter((el) => el !== option);
      oldUser[item] = newArray;
      options = oldUser[item].join(', ');
    } else {
      oldUser[item].push(option);
      options = oldUser[item].join(', ');
    }
    const data = { item, option: options, userId: this.props.user.id };
    axios({
      method: 'post',
      url: 'profile/update',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then(() => {
      this.setState({ user: oldUser });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  searchChangeHandler = (item) => (e) => {
    e.preventDefault();
    const input = e.target.value;
    const data = { input, lng: this.props.lng, type: item };
    const old = { ...this.state.search };
    axios({
      method: 'post',
      url: 'profile/searchprofile',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      old[item].results = res.data.countries;
      old[item].value = input;
      this.setState({ search: old });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  searchSubmitHandler = (item, country) => () => {
    let row;
    if (item === 'countries') {
      row = 'country_id';
    }
    const data = { item: row, option: country.country_id, userId: this.props.user.id };
    axios({
      method: 'post',
      url: 'profile/update',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then(() => {
      const oldMenuitems = { ...this.state.menuitems };
      const oldUser = { ...this.state.user };
      if (item === 'countries') {
        oldUser.country = country.title;
      }
      oldMenuitems[item] = !oldMenuitems[item];
      this.setState({ menuitems: oldMenuitems, user: oldUser });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  textChangeHandler = (item) => (e) => {
    e.preventDefault();
    const oldText = { ...this.state.text };
    oldText[item] = e.target.value;
    this.setState({ text: oldText });
  }

  textSubmitHandler = (item) => (e) => {
    e.preventDefault();
    const data = { item, option: this.state.text[item], userId: this.props.user.id };
    axios({
      method: 'post',
      url: 'profile/update',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then(() => {
      const oldMenuitems = { ...this.state.menuitems };
      const oldUser = { ...this.state.user };
      oldUser[item] = this.state.text[item];
      if (item === 'birthday') {
        oldMenuitems.age = !oldMenuitems.age;
      } else {
        oldMenuitems[item] = !oldMenuitems[item];
      }
      this.setState({ menuitems: oldMenuitems, user: oldUser });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  textareaChangeHandler = (item) => (e) => {
    e.preventDefault();
    const oldText = { ...this.state.textarea };
    oldText[item] = e.target.value;
    this.setState({ textarea: oldText });
  }

  submitTextHandler = (item) => (e) => {
    e.preventDefault();
    const data = { item, option: this.state.textarea[item], userId: this.props.user.id };
    axios({
      method: 'post',
      url: 'profile/update',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then(() => {
      const oldUser = { ...this.state.user };
      oldUser[item] = this.state.textarea[item];
      this.setState({ user: oldUser });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  updateUser = (item, result) => {
    const oldUser = { ...this.state.user };
    oldUser[item] = result;
    this.setState({ user: oldUser });
  }

  addMarker = (e) => {
    const data = { item: 'coordinates', option: e.latlng, userId: this.props.user.id };
    axios({
      method: 'post',
      url: 'profile/update',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then(() => {
      const oldUser = { ...this.state.user };
      oldUser.lat = e.latlng.lat;
      oldUser.lng = e.latlng.lng;
      this.setState({ user: oldUser });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  render() {
    return <React.Fragment>
      <UserProfileTop user={this.state.user} profile={true}/>
      <ProfileAbout {...this.props}
      clickHandler={this.clickHandler}
      menuitems={this.state.menuitems}
      user={this.state.user}
      activeMenu={this.props.activeMenu}
      menuClick={this.props.menuClick}
      photoClick={this.props.photoClick}
      photoOpened={this.props.photoOpened}
      photoClose={this.props.photoClose}
      photoIndex={this.props.photoIndex}
      posts={this.props.posts}
      profile={true}
      optionClickHandler={this.optionClickHandler}
      search={this.state.search}
      searchChangeHandler={this.searchChangeHandler}
      textChangeHandler={this.textChangeHandler}
      textSubmitHandler={this.textSubmitHandler}
      optionManyClickHandler={this.optionManyClickHandler}
      text={this.state.text}
      searchSubmitHandler={this.searchSubmitHandler}
      textarea={this.state.textarea}
      textareaChangeHandler={this.textareaChangeHandler}
      submitTextHandler={this.submitTextHandler}
      updateUser={this.updateUser}
      addMarker={this.addMarker}
      />
    </React.Fragment>;
  }
}

const mapStateToProps = (state) => {
  const props = {
    lng: state.lng,
    error: state.error,
  };
  return props;
};

const actionCreators = {
  addError: actions.addError,
};

ProfileContainer.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    country: PropTypes.string,
    city: PropTypes.string,
    height: PropTypes.number,
    weight: PropTypes.number,
    token: PropTypes.string,
    birthday: PropTypes.string,
    aboutme: PropTypes.string,
    lookingfor: PropTypes.string,
  }),
  activeMenu: PropTypes.string,
  menuClick: PropTypes.func,
  photoClick: PropTypes.func,
  photoOpened: PropTypes.bool,
  photoClose: PropTypes.func,
  photoIndex: PropTypes.number,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  profile: PropTypes.bool,
  lng: PropTypes.string,
  addError: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(ProfileContainer);
