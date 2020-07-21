import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import CommunityTitle from '../CommunityTitle/CommunityTitle';
import './Error404.css';

const Error404 = () => (
    <React.Fragment>
      <CommunityTitle title={'error.404'} subTittle={'error.404'}/>
      <section className="error404">
        <h6 className="error404__title"><Trans>error.error</Trans></h6>
        <h3 className="error404__main">404</h3>
        <h5 className="error404__bottom"><Trans>error.pagenotfound</Trans></h5>
        <Link exact to="/" className="error404__link"><Trans>error.goToHomePage</Trans></Link>
      </section>
    </React.Fragment>
);

export default Error404;
