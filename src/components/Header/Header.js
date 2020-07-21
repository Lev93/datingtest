import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import './Header.css';
import Logo from '../../assets/logo.png';
import Reg from '../../assets/registration.png';
import Login from '../../assets/login.svg';

const Header = (props) => {
  const menuClasses = ['navbar__menu'];
  if (props.mainMenu) {
    menuClasses.push('navbar__menu--opened');
  } else {
    menuClasses.filter((el) => el !== 'navbar__menu--opened');
  }
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar__container">
          <div className="navbar__header">
            <Link to="/" className="navbar__header__logo">
              <img src={Logo} alt="logo"></img>
            </Link>
            <button className="navbar__header__toggle" onClick={props.MenuButtonClick}>
              <span className="navbar__header__toggle__bar"></span>
              <span className="navbar__header__toggle__bar"></span>
              <span className="navbar__header__toggle__bar"></span>
            </button>
          </div>
          <div className={menuClasses.join(' ')}>
            <ul className="navbar__menu__list">
            {props.isAuth ? <React.Fragment>
              <li className="navbar__menu__list__item">
                <NavLink exact to="/" onClick={props.closeMenu} activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item__link"><Trans>Mainmenu.Home</Trans></NavLink>
              </li>
              <li className="navbar__menu__list__item">
                <NavLink to="/blogs" onClick={props.closeMenu} activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item__link"><Trans>Mainmenu.Blog</Trans></NavLink>
                <ul className="navbar__menu__list__item-menu navbar__menu__list__item-menu--opened">
                  <li className="navbar__menu__list__item-menu__item">
                    <NavLink to="/blogs/create" onClick={props.closeMenu} activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item-menu__item__link"><Trans>Mainmenu.blogCreate</Trans></NavLink>
                  </li>
                </ul>
              </li>
              <li className="navbar__menu__list__item">
                <NavLink to="/community" activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item__link"><Trans>Mainmenu.Community</Trans></NavLink>
                <ul className="navbar__menu__list__item-menu navbar__menu__list__item-menu--opened">
                  <li className="navbar__menu__list__item-menu__item">
                    <NavLink onClick={props.closeMenu} to="/community/advancedsearch" activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item-menu__item__link"><Trans>Mainmenu.advancedsearch</Trans></NavLink>
                  </li>
                  <li className="navbar__menu__list__item-menu__item">
                    <NavLink onClick={props.closeMenu} to="/community/mapsearch" activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item-menu__item__link"><Trans>Mainmenu.MapSearch</Trans></NavLink>
                  </li>
                  <li className="navbar__menu__list__item-menu__item">
                    <NavLink onClick={props.closeMenu} to="/community/quick" activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item-menu__item__link"><Trans>Mainmenu.QuickMatch</Trans></NavLink>
                  </li>
                </ul>
              </li>
              <li className="navbar__menu__list__item">
                <NavLink to="/messages" onClick={props.closeMenu} activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item__link"><Trans>Mainmenu.messages</Trans>{props.newMessages > 0 ? <span className="new-Messages__header"> (+{props.newMessages})</span> : null}</NavLink>
              </li>
            </React.Fragment>
              : <React.Fragment>
                <li className="navbar__menu__list__item">
                  <NavLink onClick={props.closeMenu} exact to="/" activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item__link"><Trans>Mainmenu.Home</Trans></NavLink>
                </li>
                <li className="navbar__menu__list__item">
                <NavLink to="/blogs" onClick={props.closeMenu} activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item__link"><Trans>Mainmenu.Blog</Trans></NavLink>
                <ul className="navbar__menu__list__item-menu navbar__menu__list__item-menu--opened">
                  <li className="navbar__menu__list__item-menu__item">
                    <NavLink to="/blogs/create" onClick={props.closeMenu} activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item-menu__item__link"><Trans>Mainmenu.blogCreate</Trans></NavLink>
                  </li>
                </ul>
              </li>
              </React.Fragment> }
            </ul>
            <ul className="navbar__menu__list navbar__menu__list-right">
              {props.isAuth ? <React.Fragment>
                <li className="navbar__menu__list__item">
                  <img src={Login} width ="20px" height="20px" className="navbar__menu__list__item__icon"></img>
                  <a className="navbar__menu__list__item__link" onClick={props.logout}><Trans>Mainmenu.Logout</Trans></a>
                </li>
                <li className="navbar__menu__list__item">
                  <img src={Reg} width ="20px" height="20px" className="navbar__menu__list__item__icon"></img>
                  <NavLink onClick={props.MenuButtonClick} to="/profile" activeClassName="navbar__menu__list__item__link--active" className="navbar__menu__list__item__link"><Trans>Mainmenu.MyProfile</Trans></NavLink>
                </li>
              </React.Fragment> : <React.Fragment>
                <li className="navbar__menu__list__item">
                  <img src={Login} width ="20px" height="20px" className="navbar__menu__list__item__icon"></img>
                  <a className="navbar__menu__list__item__link" onClick={props.showModalLogin}><Trans>Mainmenu.Login</Trans></a>
                </li>
                <li className="navbar__menu__list__item">
                  <img src={Reg} width ="20px" height="20px" className="navbar__menu__list__item__icon"></img>
                  <a className="navbar__menu__list__item__link" onClick={props.showModalReg}><Trans>Mainmenu.Registration</Trans></a>
                </li>
              </React.Fragment>}
              <li className="navbar__menu__list__item navbar__menu__list__item--last">
                <select className="navbar__menu__list__select" value={props.language} onChange={props.onChangeLanguage}>
                  <option className="navbar__menu__list__option">English</option>
                  <option className="navbar__menu__list__option">Русский</option>
                  <option className="navbar__menu__list__option">Український</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  MenuButtonClick: PropTypes.func,
  mainMenu: PropTypes.bool,
  language: PropTypes.string,
  onChangeLanguage: PropTypes.func,
  showModalLogin: PropTypes.func,
  showModalReg: PropTypes.func,
  isAuth: PropTypes.bool,
  logout: PropTypes.func,
  newMessages: PropTypes.number,
  closeMenu: PropTypes.func,
};

export default Header;
