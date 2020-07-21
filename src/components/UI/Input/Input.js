/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import './Input.css';

const Input = (props) => {
  const { t } = useTranslation();
  let inputElement = null;

  switch (props.elementType) {
    case ('select'):
      inputElement = (
        <select
          className={props.inputClassname ? props.inputClassname : 'input__select'}
          id={props.id}
          value={props.value}
          onChange={props.changed}>
          {props.elementConfig.options.map((option) => (
            <option key={option} value={option} >
              {t(option)}
            </option>
          ))}
        </select>
      );
      break;
    case ('range'):
      inputElement = (
        <div className="input__range__wrapper">
          <input
            className='input__range'
            value={props.value}
            id={props.id}
            onChange={props.changed}
            {...props.elementConfig}
            onChange={props.changed}>
          </input>
          <span className='input__range__distance input__range__distance--left'>{props.value} km</span>
          <span className='input__range__distance input__range__distance--right'>100 km</span>
          </div>
      );
      break;
    case ('input'):
      inputElement = (
        <input
          className={props.inputClassname ? props.inputClassname : 'input__input'}
          {...props.elementConfig}
          value={props.value}
          id={props.id}
          onChange={props.changed}>
        </input>
      );
      break;
    default:
      inputElement = <input
        className='input__text'
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed} />;
  }
  const containerClasses = props.conteinerClasses ? props.conteinerClasses : 'input__container';

  return (
    <div className={containerClasses}>
      {props.label
        ? <label className={props.labelClassName ? props.labelClassName : 'input__label input__label__main-map'}
        htmlFor={props.id}>{t(props.label)}</label> : null}
      {inputElement}
      {props.errorMessage ? <span className="input__error"><Trans>{props.errorMessage}</Trans></span> : null}
    </div>
  );
};

Input.propTypes = {
  elementType: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  id: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  changed: PropTypes.func,
  elementConfig: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.string),
  }),
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  conteinerClasses: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassname: PropTypes.string,
};

export default Input;
