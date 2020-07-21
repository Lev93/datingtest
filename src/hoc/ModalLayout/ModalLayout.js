/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '../../components/Backdrop/Backdrop';
import ModalLogin from '../../containers/ModalLogin/ModalLogin';
import ModalReg from '../../containers/ModalReg/ModalReg';
import ModalError from '../../components/ModalError/ModalError';

const ModalLayout = (props) => {
  const backdropshow = props.modalRegIsOpen || props.modalLoginIsOpen || props.modalErrorIsOpen;
  return <React.Fragment>
        {props.modalLoginIsOpen
          ? <ModalLogin
          show={props.modalLoginIsOpen}
          close={props.closeModal}
          setAutoLogout={props.setAutoLogout}
        /> : null }
        {props.modalRegIsOpen
          ? <ModalReg
            show={props.modalRegIsOpen}
            close={props.closeModal}
            showModalLogin={props.showModalLogin}
          /> : null }
        {props.modalErrorIsOpen
          ? <ModalError
            close={props.closeModal}
            error={props.errorText}
          /> : null }
        {backdropshow ? <Backdrop show clicked={props.closeModal}/> : null}
        {props.children}
      </React.Fragment>;
};


ModalLayout.propTypes = {
  children: PropTypes.node,
  modalLoginIsOpen: PropTypes.bool,
  modalRegIsOpen: PropTypes.bool,
  modalErrorIsOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  showModalLogin: PropTypes.func,
  setAutoLogout: PropTypes.func,
  errorText: PropTypes.string,
};

export default ModalLayout;
