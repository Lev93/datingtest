import React from 'react';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import PromoSearch from '../../containers/PromoSearch/PromoSearch';
import './Promo.css';

const Promo = (props) => (
    <section className="promo">
      <div className="promo__image__container">
        <Transition
          mountOnEnter
          unmountOnExit
          in={true}
          timeout={5000}>
          {() => {
            const cssClasses = [
              'promo__image',
              props.slider === 1 ? 'promo__image--first' : 'promo__image--second'];
            return (
              <div className={cssClasses.join(' ')}>
                <div className="promo__image__text__container">
                  <span className="promo__image__text"><Trans>MainPage.slogan</Trans></span>
                </div>
              </div>
            );
          }}
        </Transition>
      </div>
      <PromoSearch/>
    </section>
);

Promo.propTypes = {
  slider: PropTypes.number,
};

export default Promo;
