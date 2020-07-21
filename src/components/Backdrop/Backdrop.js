import React from 'react';
import PropTypes from 'prop-types';
import './Backdrop.css';

const Backdrop = (props) => {
  const cssClasses = ['Backdrop', props.show ? 'BackdropOpen' : 'BackdropClosed'];

  return <div className={cssClasses.join(' ')} onClick={props.clicked}></div>;
};

Backdrop.propTypes = {
  show: PropTypes.bool,
  clicked: PropTypes.func,
};

export default Backdrop;
