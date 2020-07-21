/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import './SearchFields.css';

const SearchFields = (props) => {
  const { t } = useTranslation();
  let inputElement = null;

  switch (props.item.type) {
    case ('chooseOne'):
      inputElement = (
        <select
          value={props.value}
          className="search-input__input"
          id={props.item.name}
          onChange={props.onChange(props.item)}>
          <option value = "" disabled>{t('advancedSearch.chooseOne')}</option>
          {props.item.options.map((option) => (
            <option key={option} value={option}>
              {t(`userPage.${props.activeMenu}.${props.item.name}.${option}`)}
            </option>
          ))}
        </select>
      );
      break;
    case ('chooseMany'):
      inputElement = (
        <a
        className="search-input__link"
        id={props.item.name}
        onClick={props.itemClick(props.item.name.toLowerCase())}
        >
          {props.value.length > 0 ? props.value.map((option) => (
            t(`userPage.${props.activeMenu}.${props.item.name}.${option}`))).join(', ')
            : <Trans>userPage.adddescription</Trans>}
          {props.menu[props.item.name.toLowerCase()]
            ? <ul className="search-input__menu">
                {props.item.options.map((option) => {
                  const className = props.value.includes(option)
                    ? 'search-input__menu__item--active' : 'search-input__menu__item';
                  return <li key={option} className={className}
                  onClick={props.onChange(props.item, option)}>
                    <Trans>userPage.{props.activeMenu}.{props.item.name}.{option}</Trans>
                  </li>;
                })}
              </ul>
            : null}
        </a>
      );
      break;
    case ('input'):
      if (props.item.inputType === 'number') {
        inputElement = (<React.Fragment>
          <input
            type={props.item.inputType}
            className="search-input__input--number"
            value={props.value.from}
            onChange={props.onChange(props.item, 0, 'from')}
            >
          </input>
          <span className="search-input__-">-</span>
          <input
            type={props.item.inputType}
            className="search-input__input--number"
            value={props.value.to}
            onChange={props.onChange(props.item, 0, 'to')}
            >
          </input>
        </React.Fragment>);
      } else {
        inputElement = (<input
            type={props.item.inputType}
            className="search-input__input"
            value={props.value}
            onChange={props.onChange(props.item)}
            >
            </input>);
      }
      break;
    case ('search'):
      inputElement = (<React.Fragment>
        <input
          type='text'
          className="search-input__input"
          value={props.search[props.item.name.toLowerCase()].value}
          onChange={props.searchChangeHandler(props.item.name.toLowerCase())}
        >
        </input>
        {props.search[props.item.name.toLowerCase()].results.length > 0
          ? <ul className="search-input__menu">
        {props.search[props.item.name.toLowerCase()].results.map((country) => (
          <li key={country.title}
            className="search-input__menu__item"
            onClick={props.onChange(props.item, country)}>
            {country.title}
          </li>))}
      </ul> : null}
      </React.Fragment>);
      break;
    default:
      inputElement = (<input
        type={props.item.inputType}
        className="search-input__input"
        value={props.value}
        onChange={props.onChange(props.item)}
        >
    </input>);
  }
  return (
    <div className="search-input__container">
      <label className="search-input__label" htmlFor={props.item.name}><Trans>userPage.{props.activeMenu}.{props.item.name}.name</Trans></label>
      {inputElement}
    </div>
  );
};

SearchFields.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    options: PropTypes.array,
    inputType: PropTypes.string,
  }),
  menu: PropTypes.shape(),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
  ]),
  activeMenu: PropTypes.string,
  onChange: PropTypes.func,
  itemClick: PropTypes.func,
  search: PropTypes.shape({
    value: PropTypes.string,
    results: PropTypes.string,
  }),
  searchChangeHandler: PropTypes.func,
  lng: PropTypes.string,
};

export default SearchFields;
