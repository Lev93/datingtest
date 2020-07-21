import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import './Slide.css';
import Star from '../../../assets/star.svg';

const Slide = (props) => {
  const rating = [];
  for (let i = 0; i < props.review.rating; i += 1) {
    rating.push(<li className="mobile__description__reviews__inner__review__star" key={props.review.author + i}><img src={Star} width='14px'></img></li>);
  }
  return (<div className="mobile__description__reviews__inner__review">
    <p className="mobile__description__reviews__inner__review__text"><Trans>{props.review.text}</Trans></p>
    <p className="mobile__description__reviews__inner__review__author">{props.review.author}</p>
    <ul className="mobile__description__reviews__inner__review__rating">
      {rating.map((el) => el)}
    </ul>
  </div>

  );
};


Slide.propTypes = {
  review: PropTypes.shape({
    text: PropTypes.string,
    author: PropTypes.string,
    rating: PropTypes.number,
  }),
};

export default Slide;
