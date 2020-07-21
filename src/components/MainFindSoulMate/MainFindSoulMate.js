import React from 'react';
import { Trans } from 'react-i18next';
import Strip from '../../assets/strip.png';
import Img1 from '../../assets/soul-1.png';
import Img2 from '../../assets/soul-2.png';
import Img3 from '../../assets/soul-3.png';
import './MainFindSoulMate.css';

const MainFindSoulMate = () => (
  <section className="findsoulmate">
    <div className="findsoulmate-container">
      <div className="findsoulmate__title">
        <h3 className="findsoulmate__title__text"><Trans>MainPage.soulmate.maintitle</Trans></h3>
        <img src={Strip} className="welcome__title__img"></img>
      </div>
      <div className="findsoulmate__actions">
        <div className="findsoulmate__actions__item">
          <img src={Img1} className="findsoulmate__actions__item__img"></img>
          <p className="findsoulmate__actions__item__number"><Trans>MainPage.soulmate.createprofile</Trans></p>
          <p className="findsoulmate__actions__item__text"><Trans>MainPage.soulmate.createprofiletext</Trans></p>
        </div>
        <div className="findsoulmate__actions__item">
          <img src={Img2} className="findsoulmate__actions__item__img"></img>
          <p className="findsoulmate__actions__item__number"><Trans>MainPage.soulmate.findmatches</Trans></p>
          <p className="findsoulmate__actions__item__text"><Trans>MainPage.soulmate.findmatchestext</Trans></p>
        </div>
        <div className="findsoulmate__actions__item">
          <img src={Img3} className="findsoulmate__actions__item__img"></img>
          <p className="findsoulmate__actions__item__number"><Trans>MainPage.soulmate.startdating</Trans></p>
          <p className="findsoulmate__actions__item__text"><Trans>MainPage.soulmate.startdatingtext</Trans></p>
        </div>
      </div>
    </div>
  </section>
);

export default MainFindSoulMate;
