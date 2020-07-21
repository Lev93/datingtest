/* eslint-disable class-methods-use-this */
/* eslint arrow-body-style: 0 */
/* eslint no-unused-vars: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Map,
  Marker,
  TileLayer,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import * as actions from '../../actions';
import MainMapSearch from '../MainMapSearch/MainMapSearch';
import MarkerIcon from '../../assets/map-marker.png';

import './MainMap.css';

const icon = L.icon({
  iconUrl: MarkerIcon,
  iconSize: [27, 27],
});

const calculateAge = (date) => Math.floor((Date.now() - new Date(date)) / 31536000000);

class MainMap extends React.PureComponent {
  state = {
    zoom: 13,
    mapMenuOpened: true,
    position: [this.props.center.lat, this.props.center.lng],
  }

  componentDidMount() {
    this.map = this.mapInstance.leafletElement;
  }

  componentDidUpdate(prevProps) {
    if (this.props.center.lat !== prevProps.center.lat) {
      this.setState(
        { position: [this.props.center.lat, this.props.center.lng] },
      );
    }
  }

  mapMenuToggle=() => {
    this.setState((prevState) => {
      return { mapMenuOpened: !prevState.mapMenuOpened };
    });
  }

  render() {
    const toggleClasses = ['main-map__search__toggle', this.state.mapMenuOpened ? 'main-map__search__toggle__opened' : 'main-map__search__toggle__closed'];
    const menuClasses = ['main-map__search', this.state.mapMenuOpened ? 'main-map__search--opened' : 'main-map__search--closed'];
    return (
      <section className="main-map">
        <Map center={this.state.position}
        zoom={this.state.zoom}
        maxZoom = {18}
        ref={(e) => { this.mapInstance = e; } }>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.props.users.map((user) => <Marker
            position={[user.lat, user.lng]}
            key={user.id}
            icon={icon}>
            <Popup >
            <Link to={`/community/${user.id}`} className="popup__link">
              <div className = "popup__avatar__wrapper">
                <img className = "popup__avatar" src={user.avatar} />
              </div>
              <p className= "popup__name">{user.name}</p>
              <p className= "popup__age">{calculateAge(user.birthday)}<Trans>MainPage.age</Trans></p>
            </Link>
            <br/>
            </Popup>
          </Marker>)}
        </Map>
        {this.props.sidePanel
          ? <React.Fragment>
              <div className={menuClasses.join(' ')}>
                <h4 className="main-map__search__title"><Trans>MainPage.map.title</Trans></h4>
                <MainMapSearch/>
              </div>
              <button className={toggleClasses.join(' ')} onClick={this.mapMenuToggle}></button>
              </React.Fragment>
          : null}
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    lng: state.lng,
    coordinates: state.coordinates,
  };
  return props;
};

const actionCreators = {
  onChangeLanguage: actions.changeLanguage,
};

MainMap.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
  })),
  changeCoordinates: PropTypes.func,
  center: PropTypes.shape(),
  sidePanel: PropTypes.bool,
};

export default connect(mapStateToProps, actionCreators)(MainMap);
