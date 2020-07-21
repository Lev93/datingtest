import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Swiper from 'react-id-swiper';
import Slide from './Slide/Slide';
import Android from '../../assets/android.svg';
import Apple from '../../assets/apple.svg';
import Windows from '../../assets/windows.svg';
import Screen1 from '../../assets/screen-1.png';
import 'swiper/css/swiper.css';
import './Mobile.css';

const Mobile = (props) => {
  const params = {
    slidesPerView: 1,
    navigation: {
      nextEl: '.mobile__description__reviews__navigation__right',
      prevEl: '.mobile__description__reviews__navigation__left',
    },
  };
  const params2 = {
    slidesPerView: 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
  };
  const screens = [Screen1, Screen1, Screen1];
  return (<section className="mobile">
  <div className="mobile__container">
    <div className="mobile__description">
      <div className="mobile__description__links">
        <h3 className="mobile__description__links__title">
          <Trans>MainPage.mobileTitle</Trans>
        </h3>
        <p className="mobile__description__links__text">
          <Trans>MainPage.mobileText</Trans>
        </p>
        <ul className="mobile__description__links__list">
          <li className="mobile__description__links__list__item">
            <a className="mobile__description__links__list__item__link">
              <img src={Android} width='40px' height="48px"></img>
            </a>
          </li>
          <li className="mobile__description__links__list__item">
            <a className="mobile__description__links__list__item__link">
              <img src={Apple} width='40px' height="48px"></img>
            </a>
          </li>
          <li className="mobile__description__links__list__item">
            <a className="mobile__description__links__list__item__link">
              <img src={Windows} width='40px' height="48px"></img>
            </a>
          </li>
        </ul>
      </div>
      <div className="mobile__description__reviews">
        <Swiper {...params}>
          {props.reviews.map((review) => <div key={review.author}>
          <Slide review={review}/>
          </div>)}
        </Swiper>
      </div>
    </div>
    <div className="mobile__example">
      <div className="mobile__example__container">
        <div className="mobile__example__swiper">
          <Swiper {...params2}>
            {screens.map((screen, i) => <img key={i} src={screen} className="mobile__example__swiper__img" width="292px" height="419px"></img>)}
          </Swiper>
        </div>
      </div>
    </div>
  </div>
  </section>
  );
};


Mobile.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    author: PropTypes.string,
    rating: PropTypes.number,
  })),
};

export default Mobile;
