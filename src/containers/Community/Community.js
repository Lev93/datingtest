/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CommunityTitle from '../../components/CommunityTitle/CommunityTitle';

class MainPage extends Component {
  state = {
    isLoaded: false,
    blogs: [],
  }

  componentDidMount() {
    this.setState({
      isLoaded: true,
    });
  }

  render() {
    const mainPage = (<React.Fragment>
       <CommunityTitle title={'community.mainTitle'} subTittle={'community.mainTitle'} />
    </React.Fragment >);
    return this.state.isLoaded ? mainPage : null;
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

};

MainPage.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
};

export default connect(mapStateToProps, actionCreators)(MainPage);
