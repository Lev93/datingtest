import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import uniqid from 'uniqid';
import { Trans } from 'react-i18next';
import 'swiper/css/swiper.css';
import './LatestRegisteredMembers.css';
import { Link } from 'react-router-dom';
import Strip from '../../assets/strip.png';

const calculateAge = (date) => Math.floor((Date.now() - new Date(date)) / 31536000000);

const LatestRegisteredMembers = (props) => {
  const params1 = {
    slidesPerView: 'auto',
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  const params2 = {
    slidesPerView: 'auto',
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  return <section className="main-registered">
    <div className="main-registered__container">
      <div className="main-registered__title">
        <h3 className="main-registered__title__text"><Trans>MainPage.lastRegistered</Trans></h3>
        <img src={Strip} className="welcome__title__img"></img>
      </div>
      <div className="main-registered__users main-registered__users--small">
        <Swiper {...params1}>
          {props.users.map((user) => (<div className="main-registered__user" key={uniqid()}>
            <img className="main-registered__user__img" src={user.avatar}></img>
            <div className="main-registered__user__conteiner">
              <Link to={`/community/${user.id}`} className='main-registered__user__name'>{user.name}</Link>
              <p className='main-registered__user__age'>{calculateAge(user.birthday)}
              <Trans>MainPage.age</Trans></p>
            </div>
          </div>
          ))}
      </Swiper>
      </div>
      <div className="main-registered__users main-registered__users--big">
        <Swiper {...params2}>
          {props.users.map((user) => (<div className="main-registered__user" key={uniqid()}>
            <img className="main-registered__user__img" src={user.avatar}></img>
            <div className="main-registered__user__conteiner">
              <Link to={`/community/${user.id}`} className='main-registered__user__name'>{user.name}</Link>
              <p className='main-registered__user__age'>{calculateAge(user.birthday)}
              <Trans>MainPage.age</Trans></p>
            </div>
          </div>
          ))}
      </Swiper>
      </div>
    </div>
  </section>;
};

LatestRegisteredMembers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    birthday: PropTypes.date,
    id: PropTypes.string,
    avatar: PropTypes.string,
  })),
};

export default LatestRegisteredMembers;
