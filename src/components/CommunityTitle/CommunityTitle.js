import React from 'react';
import { Trans, withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Left from '../../assets/t-left-img.png';
import Right from '../../assets/t-right-img.png';
import './CommunityTitle.css';

const CommunityTitle = (props) => (
    <section className="community-title">
      <div className="community-title__container2">
        <div className="community-title__text__container">
          <img src={Left} width="50px" height="11px" className="community-title__text__img"></img>
          <h3 title={props.t(props.title)} className="community-title__text"><Trans>{props.title}</Trans></h3>
          <img src={Right} width="50px" height="11px" className="community-title__text__img"></img>
        </div>
        <p className="community__under-title"><Trans>{props.subTittle}</Trans></p>
      </div>
    </section>
);

CommunityTitle.propTypes = {
  t: PropTypes.func,
  title: PropTypes.string,
  subTittle: PropTypes.string,
};

export default withTranslation()(CommunityTitle);
