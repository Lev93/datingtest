import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './Button.css';

const Button = (props) => {
  const { t } = useTranslation();
  return (<button
        type = {props.type}
        className={props.classes}
        onClick={props.clicked}
        disabled={props.disabled}
        >{t(props.children)}</button>
  );
};

Button.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  type: PropTypes.string.isRequired,
  classes: PropTypes.string.isRequired,
  clicked: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
