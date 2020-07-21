import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Strip from '../../assets/strip.png';
import Icon1 from '../../assets/w-icon-1.png';
import Icon2 from '../../assets/w-icon-2.png';
import Icon3 from '../../assets/w-icon-3.png';
import Icon4 from '../../assets/w-icon-4.png';
import './Welcome.css';

const Welcome = (props) => (
  <section className="welcome">
    <div className="welcome-container">
      <div className="welcome__title">
        <h3 className="welcome__title__text"><Trans>MainPage.welcome</Trans></h3>
        <img src={Strip} className="welcome__title__img"></img>
      </div>
      <div className="welcome__members">
        <div className="welcome__members__item">
          <img src={Icon1} className="welcome__members__item__img"></img>
          <p className="welcome__members__item__number">{props.welcomeinfo.totalMembers}</p>
          <p className="welcome__members__item__text"><Trans>MainPage.totalMembers</Trans></p>
        </div>
        <div className="welcome__members__item">
          <img src={Icon2} className="welcome__members__item__img"></img>
          <p className="welcome__members__item__number">{props.welcomeinfo.membersOnline}</p>
          <p className="welcome__members__item__text"><Trans>MainPage.membersOnline</Trans></p>
        </div>
        <div className="welcome__members__item">
          <img src={Icon3} className="welcome__members__item__img"></img>
          <p className="welcome__members__item__number">{props.welcomeinfo.menOnline}</p>
          <p className="welcome__members__item__text"><Trans>MainPage.menOnline</Trans></p>
        </div>
        <div className="welcome__members__item">
          <img src={Icon4} className="welcome__members__item__img"></img>
          <p className="welcome__members__item__number">{props.welcomeinfo.womenOnline}</p>
          <p className="welcome__members__item__text"><Trans>MainPage.womenOnline</Trans></p>
        </div>
      </div>
    </div>
  </section>
);

Welcome.propTypes = {
  welcomeinfo: PropTypes.shape({
    totalMembers: PropTypes.number,
    membersOnline: PropTypes.number,
    menOnline: PropTypes.number,
    womenOnline: PropTypes.number,
  }),
};

export default Welcome;
