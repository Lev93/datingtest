import React from 'react';
import { Trans } from 'react-i18next';
import Swiper from 'react-id-swiper';
import PropTypes from 'prop-types';
import 'swiper/css/swiper.css';
import './QuickMatchUserPhotos.css';

const calculateAge = (date) => Math.floor((Date.now() - new Date(date)) / 31536000000);

const QuickMatchUserPhotos = (props) => {
  const params = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  };
  return <section className="quick-photos">
   <div className="quick-photos__conteiner">
      <div className="quick-photos__header">
        <div className="quick-photos__left">
          <h3 className="quick-photos__left__name">{props.activeUser.name}</h3>
          <h4 className="quick-photos__left__parameters">{calculateAge(props.activeUser.birthday)} <Trans>MainPage.age</Trans></h4>
          <h4 className="quick-photos__left__parameters">{props.activeUser.city || ''}, {props.activeUser.country || ''}</h4>
        </div>
        <div className="quick-photos__right">
          <a className="quick-photos__right__button" onClick={() => props.likeClick('like')}>
            <svg className ="quick-photos__right__button__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/>
            </svg>
          </a>
          <a className="quick-photos__right__button" onClick={() => props.likeClick('decline')}>
            <svg className ="quick-photos__right__button__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
            </svg>
          </a>
        </div>
      </div>
      <div className="quick-photos__photos">
        {props.activeUser.photos.length === 0 ? <div className="quick-photos__photos__no"><Trans>quickMatch.nophotos</Trans></div>
          : <Swiper {...params}>
          {props.activeUser.photos.map((img, i) => (
            <div className="quick-photos__photo-slide" key={`photo-${i}`}>
            <img className="quick-photos__photo" src={img}></img>
            </div>))}
        </Swiper>
        }
      </div>
   </div>
  </section>;
};

QuickMatchUserPhotos.propTypes = {
  activeUser: PropTypes.shape,
  likeClick: PropTypes.func,
};

export default QuickMatchUserPhotos;
