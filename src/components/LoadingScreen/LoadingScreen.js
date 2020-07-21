import React from 'react';
import { Trans } from 'react-i18next';
import './LoadingScreen.css';

const LoadingScreen = () => (<section className="loading">
      <div className="loading__conteiner">
        <div className="loading__conteiner__spinner">
           <div className="loadingio-spinner-heart-wyz5f2mzzv"><div className="ldio-knom4ee6oj">
           <div><div></div></div>
           </div></div>
        </div>
        <h1 className="loading__conteiner__text"><Trans>loading</Trans></h1>
      </div>
    </section>
);

export default LoadingScreen;
