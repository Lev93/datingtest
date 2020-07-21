/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Strip from '../../assets/strip.png';
import * as actions from '../../actions';
import './MapSearchFields.css';

const formatDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;
  const yy = date.getFullYear();
  return `${yy}-${mm}-${dd}`;
};

const provider = new OpenStreetMapProvider();

class MapSearchFields extends Component {
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

  componentDidUpdate(prevProps) {
    if (this.props.parametersFromMain !== prevProps.parametersFromMain) {
      this.setState({
        controls: this.props.parametersFromMain,
      });
      this.props.clearMapParameters();
    }
  }

  inputChangedHandler = (event, controlName) => {
    const { value } = event.target;
    const old = this.props.mainParameters;
    const updatedControls = this.state.controls;
    updatedControls[controlName].value = value;
    old[controlName] = value;
    if (controlName === 'city' && value !== '') {
      provider.search({ query: value })
        .then((res) => {
          updatedControls.city.coordinates = {
            lat: res[0].y,
            lng: res[0].x,
          };
          old.city = value;
          old.center = {
            lat: res[0].y,
            lng: res[0].x,
          };
        });
    }
    this.props.updateMainState({
      mainParameters: old,
    });
    this.setState({ controls: updatedControls });
  }

  search = (e) => {
    e.preventDefault();
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
      url: './mapsearch',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      this.props.updateMainState({
        users: res.data.users,
        center: { lat, lng },
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  render() {
    const formElementsArray = Object.keys(this.state.controls);
    return (
      <div className="map__search__container">
        <div className="map__search__title__container">
          <h3 className="map__search__title">
            <Trans>mapSearch.find</Trans>
          </h3>
          <img src={Strip} alt=""></img>
        </div>
        <form className="map__search__form">
          {formElementsArray.map((input) => {
            return <Input
            key={this.state.controls[input].id}
            id={this.state.controls[input].id}
            elementType={this.state.controls[input].elementType}
            elementConfig={this.state.controls[input].elementConfig}
            value={this.state.controls[input].value}
            label={this.state.controls[input].label}
            changed={(event) => this.inputChangedHandler(event, this.state.controls[input].id)}
            conteinerClasses={input === 'distance' ? 'map__search__form__range__container' : this.state.classes}
            labelClassName={'map__search__form__label'}
            inputClassname={input === 'distance' ? '' : 'map__search__form__input'}
            />;
          })}
          <Button type="submit" classes="redButton" clicked={this.search}>MainPage.search</Button>
        </form>
        <a className={this.props.advancedSearch ? 'map__search__advanced__link' : 'map__search__advanced__link--close'}
          onClick={this.props.showHideSearch}>
          {this.props.advancedSearch ? <Trans>mapSearch.closeAdvancedSearch</Trans>
            : <Trans>mapSearch.advancedSearch</Trans>}
        </a>
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
  clearMapParameters: actions.clearMapParameters,
  addError: actions.addError,
};

MapSearchFields.propTypes = {
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
  parametersFromMain: PropTypes.shape(),
  clearMapParameters: PropTypes.func,
  addError: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(MapSearchFields);
