/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CommunityTitle from '../../components/CommunityTitle/CommunityTitle';
import AdvancedSearchFields from '../AdvancedSearchFields/AdvancedSearchFields';
import MapSearchFields from '../MapSearchFields/MapSearchFields';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import MainMap from '../MainMap/MainMap';

class Advancedsearch extends Component {
  state = {
    isLoaded: true,
    users: [],
    advancedSearch: false,
    center: {
      lat: 0,
      lng: 0,
    },
    parameters: '',
    mainParameters: {
      gender: 'mapSearch.man',
      city: '',
      center: {
        lat: this.props.coordinates.lat,
        lng: this.props.coordinates.lng,
      },
      searchFrom: '',
      searchTo: '',
      distance: 0,
    },
    parametersFromMain: {},
  }

  componentDidMount() {
    if (this.props.mapSearchParameters.users.length > 0) {
      const { mainParameters } = this.state;
      let { parametersFromMain } = this.state;
      mainParameters.city = this.props.mapSearchParameters.parameters.city.value;
      mainParameters.center = this.props.mapSearchParameters.parameters.city.coordinates;
      mainParameters.gender = this.props.mapSearchParameters.parameters.gender.value;
      mainParameters.searchFrom = this.props.mapSearchParameters.parameters.searchFrom.value;
      mainParameters.searchTo = this.props.mapSearchParameters.parameters.searchTo.value;
      mainParameters.distance = this.props.mapSearchParameters.parameters.distance.value;
      parametersFromMain = this.props.mapSearchParameters.parameters;
      this.setState({
        users: this.props.mapSearchParameters.users,
        mainParameters,
        parametersFromMain,
      });
    }
    if (this.props.mapSearchParameters.parameters.city) {
      if (this.props.mapSearchParameters.parameters.city.coordinates.lat
        && this.props.mapSearchParameters.parameters.city.value !== '') {
        this.setState({
          center: {
            lat: this.props.mapSearchParameters.parameters.city.coordinates.lat,
            lng: this.props.mapSearchParameters.parameters.city.coordinates.lng,
          },
        });
      } else {
        this.setState({
          center: { lat: this.props.coordinates.lat, lng: this.props.coordinates.lng },
        });
      }
    } else {
      this.setState({
        center: { lat: this.props.coordinates.lat, lng: this.props.coordinates.lng },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.coordinates.lat !== prevProps.coordinates.lat) {
      this.setState(
        { center: { lat: this.props.coordinates.lat, lng: this.props.coordinates.lng } },
      );
    }
  }

  updateMainState = (parameters) => {
    this.setState({ ...parameters });
  }

  showHideSearch = () => {
    this.setState((prevState) => {
      return { advancedSearch: !prevState.advancedSearch };
    });
  }

  render() {
    const mainPage = (<React.Fragment>
      <CommunityTitle title={'mapSearch.title'} subTittle={'advancedSearch.mainTitle'}/>
      <MapSearchFields
        showHideSearch={this.showHideSearch}
        advancedSearch={this.state.advancedSearch}
        updateMainState={this.updateMainState}
        mainParameters={this.state.mainParameters}
        parametersFromMain={this.state.parametersFromMain}
      />
      {this.state.advancedSearch
        ? <AdvancedSearchFields
          updateMainState={this.updateMainState}
          users={this.state.users}
          type={'map'}
          mainParameters={this.state.mainParameters}
          center={this.state.center}
        />
        : null }
      <MainMap users={this.state.users} center={this.state.center}/>
    </React.Fragment >);
    return this.state.isLoaded ? mainPage : <LoadingScreen/>;
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    lng: state.lng,
    coordinates: state.coordinates,
    mapSearchParameters: state.mapSearchParameters,
  };
  return props;
};

const actionCreators = {

};

Advancedsearch.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  coordinates: PropTypes.shape(),
  mapSearchParameters: PropTypes.shape(),
};

export default connect(mapStateToProps, actionCreators)(Advancedsearch);
