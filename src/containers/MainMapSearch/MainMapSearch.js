/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { withRouter } from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../actions';
import './MainMapSearch.css';

const formatDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;
  const yy = date.getFullYear();
  return `${yy}-${mm}-${dd}`;
};

const provider = new OpenStreetMapProvider();

class MainMapSearch extends Component {
  state = {
    controls: {
      gender: {
        id: 'gender',
        elementType: 'select',
        value: 'mapSearch.man',
        label: 'MainPage.seeking',
        elementConfig: {
          options: ['mapSearch.man', 'mapSearch.woman'],
        },
      },
      city: {
        id: 'city',
        elementType: 'input',
        label: 'MainPage.map.city',
        value: '',
        coordinates: {},
        elementConfig: {
          type: 'text',
        },
      },
      searchFrom: {
        id: 'searchFrom',
        elementType: 'input',
        value: '',
        label: 'MainPage.from',
        elementConfig: {
          type: 'number',
        },
      },
      searchTo: {
        id: 'searchTo',
        elementType: 'input',
        value: '',
        label: 'MainPage.to',
        elementConfig: {
          type: 'number',
        },
      },
      distance: {
        id: 'distance',
        elementType: 'range',
        value: 0,
        label: 'MainPage.map.distance',
        elementConfig: {
          type: 'range',
          min: '0',
          max: '100',
          step: '1',
        },
      },
    },
    classes: 'map__search__form__input__container',
  }

  inputChangedHandler = (event, controlName) => {
    const { value } = event.target;
    const updatedControls = this.state.controls;
    updatedControls[controlName].value = value;
    if (controlName === 'city' && value !== '') {
      provider.search({ query: value })
        .then((res) => {
          updatedControls.city.coordinates = {
            lat: res[0].y,
            lng: res[0].x,
          };
          updatedControls.city.value = value;
        });
    }
    this.setState({ controls: updatedControls });
  }

  search = (e) => {
    e.preventDefault();
    if (!this.props.user.isAuth) {
      this.props.addError('notAuthenticated');
      return;
    }
    const controls = { ...this.state.controls };
    let { lat, lng } = this.props.coordinates;
    const parametersArray = [];
    if (controls.city.value !== '') {
      parametersArray.push(`city = "${controls.city.value}"`);
      lat = this.state.controls.city.coordinates.lat;
      lng = this.state.controls.city.coordinates.lng;
    }
    if (controls.gender.value === 'mapSearch.woman') {
      parametersArray.push('gender = "female"');
    } else {
      parametersArray.push('gender = "male"');
    }
    if (controls.searchFrom.value !== '') {
      const birthadayfrom = new Date(Date.now());
      birthadayfrom.setFullYear(birthadayfrom.getFullYear() - controls.searchFrom.value);
      const formatedFrom = formatDate(birthadayfrom);
      parametersArray.push(`birthday <= "${formatedFrom}"`);
    }
    if (controls.searchTo.value !== '') {
      const birthadayfrom = new Date(Date.now());
      birthadayfrom.setFullYear(birthadayfrom.getFullYear() - controls.searchTo.value);
      const formatedFrom = formatDate(birthadayfrom);
      parametersArray.push(`birthday >= "${formatedFrom}"`);
    }

    const parameters = parametersArray.join(' AND ');

    const data = {
      parameters,
      distance: controls.distance.value,
      lat,
      lng,
    };
    axios({
      method: 'post',
      url: '/community/mapsearch',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      this.props.addMapParameters({
        users: res.data.users,
        parameters: controls,
      });
      this.props.history.push('/community/mapsearch');
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  render() {
    const formElementsArray = Object.keys(this.state.controls);
    return (
      <div className="main-map__search__container">
        <form className="main-map__search__form">
          {formElementsArray.map((input) => {
            return <Input
            key={this.state.controls[input].id}
            id={this.state.controls[input].id}
            elementType={this.state.controls[input].elementType}
            elementConfig={this.state.controls[input].elementConfig}
            value={this.state.controls[input].value}
            label={this.state.controls[input].label}
            changed={(event) => this.inputChangedHandler(event, this.state.controls[input].id)}
            conteinerClasses={this.state.classes}/>;
          })}
          <Button type="submit" classes="redButton" clicked={this.search}>MainPage.search</Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    coordinates: state.coordinates,
  };
  return props;
};

const actionCreators = {
  addMapParameters: actions.addMapParameters,
  addError: actions.addError,
};

MainMapSearch.propTypes = {
  showHideSearch: PropTypes.func,
  advancedSearch: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    token: PropTypes.string,
  }),
  updateMainState: PropTypes.func,
  coordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  mainParameters: PropTypes.shape(),
  addMapParameters: PropTypes.func,
  history: PropTypes.shape(),
  addError: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(withRouter(MainMapSearch));
