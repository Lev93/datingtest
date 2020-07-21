import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import './ModalError.css';
import Close from '../../assets/close-btn.png';

const ModalError = (props) => (
    <div className="modal">
      <div className="modal-error">
        <h4 className="modal__title"><Trans>error.error</Trans></h4>
        <p className="modal__text"><Trans>error.{props.error}</Trans></p>
        <a className = "modal__close" onClick={props.close}><img src={Close}></img></a>
      </div>
    </div>
);

ModalError.propTypes = {
  error: PropTypes.error,
  close: PropTypes.func,
};

export default ModalError;
