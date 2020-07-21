import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from '../UI/Button/Button';
import './UserProfileTop.css';


const calculateAge = (date) => Math.floor((Date.now() - new Date(date)) / 31536000000);
const calculateDuration = (lastOnline) => {
  const difference = Date.now() - new Date(lastOnline);
  if (difference < 3600000) {
    return <React.Fragment>{Math.floor(difference / 60000)}
      <Trans>community.minAgo</Trans>
    </React.Fragment>;
  }
  if (difference < 86400000) {
    return <React.Fragment>{Math.floor(difference / 3600000)}
      <Trans>community.hoursAgo</Trans>
    </React.Fragment>;
  }
  return <React.Fragment>{Math.floor(difference / 86400000)}
    <Trans>community.daysAgo</Trans>
  </React.Fragment>;
};

const UserProfileTop = (props) => {
  const style = {
    backgroundImage: `url(${props.user.background})`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundPosition: 'center',
    minHeight: '421px',
    position: 'relative',
    backgroundSize: 'cover',
  };
  let button = null;
  if (!props.profile && props.isAuth) button = <Button type="button" classes="redButton" clicked={props.openChat}>userPage.chat</Button>;
  return <section className="userpage-top" style={ style }>
      <div className="userpage-top__container">
        <div className="userpage-top__text__container">
          <img src={props.user.avatar} className="userpage-top__text__avatar"></img>
          <div className="userpage-top__text__container2">
            <h3 className="userpage-top__name">{props.user.name}</h3>
            <span className="userpage-top__text">{calculateAge(props.user.birthday)}<Trans>MainPage.age</Trans></span>
            <span className="userpage-top__text">{props.user.country}, {props.user.city}</span>
            {props.profile ? null : <span className="userpage-top__text"><Trans>community.lastonline</Trans> {calculateDuration(props.user.last_online)}</span>}
          </div>
        </div>
        <div className="userpage-top__buttons__container">
          {button}
        </div>
      </div>
    </section>;
};

UserProfileTop.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    avatar: PropTypes.string,
    birthday: PropTypes.date,
    country: PropTypes.string,
    city: PropTypes.string,
    last_online: PropTypes.date,
    background: PropTypes.string,
  }),
  profile: PropTypes.bool,
  openChat: PropTypes.func,
  isAuth: PropTypes.bool,
};

export default UserProfileTop;
