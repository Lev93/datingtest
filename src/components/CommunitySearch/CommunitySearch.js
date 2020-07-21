import React from 'react';
import { Trans } from 'react-i18next';
import PromoSearch from '../../containers/PromoSearch/PromoSearch';
import Left from '../../assets/t-left-img.png';
import Right from '../../assets/t-right-img.png';
import './CommunitySearch.css';

const CommunitySearch = () => (
    <section className="community-title">
      <div className="community-title__container">
        <div className="community-title__text__container">
          <img src={Left} width="50px" height="11px" className="community-title__text__img"></img>
          <h3 className="community-title__text"><Trans>community.mainTitle</Trans></h3>
          <img src={Right} width="50px" height="11px" className="community-title__text__img"></img>
        </div>
        <p className="community__under-title"><Trans>community.advancedSearch</Trans></p>
      </div>
     <PromoSearch/>
    </section>
);

export default CommunitySearch;
