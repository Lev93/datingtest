/* eslint-disable class-methods-use-this */
/* eslint arrow-body-style: 0 */
/* eslint no-unused-vars: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Map,
  Marker,
  TileLayer,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import MarkerIcon from '../../assets/map-marker.png';

import './ProfileMap.css';

const icon = L.icon({
  iconUrl: MarkerIcon,
  iconSize: [27, 27],
});

const calculateAge = (date) => Math.floor((Date.now() - new Date(date)) / 31536000000);

const MainMap = (props) => {
  const position = [props.user.lat, props.user.lng];
  const click = {};
  if (props.addMarker) {
    click.onClick = props.addMarker;
  }
  return (
    <Map center={position}
      zoom={13}
      maxZoom = {18}
      { ...click }
      >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <Marker
        position={[props.user.lat, props.user.lng]}
        icon={icon}>
        <Popup >
          <Link to={`/community/${props.user.id}`} className="popup__link">
            <img className = "popup__avatar" src={props.user.avatar} />
            <p className= "popup__name">{props.user.name}</p>
            <p className= "popup__name">{calculateAge(props.user.birthday)}<Trans>MainPage.age</Trans></p>
          </Link>
        </Popup>
       </Marker>
     </Map>
  );
};

MainMap.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    birthday: PropTypes.string,
  }),
  addMarker: PropTypes.func,
};

export default MainMap;
