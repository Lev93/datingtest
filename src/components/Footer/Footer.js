import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { Trans } from 'react-i18next';
import './Footer.css';
import Logo from '../../assets/logo.png';
import Facebook from '../../assets/facebook.svg';
import Vk from '../../assets/vk.svg';
import Instagram from '../../assets/instagram.svg';
import Odnoklassniki from '../../assets/odnoklassniki.svg';

const Footer = (props) => (
    <footer className="footer">
      <div className="footer__conteiner">
        <div className="footer__item">
          <Link to="/" className="footer__logo__link">
            <img src={Logo} alt="logo"></img>
          </Link>
          <p className="footer__logo__text">
            <Trans>footer.text1</Trans>
          </p>
          <p className="footer__logo__text">
            <Trans>footer.text2</Trans>
          </p>
        </div>
        <div className="footer__item">
          <h3 className="footer__information"><Trans>footer.information</Trans></h3>
          <ul className="footer__information__list">
            <li className="footer__information__list__item">
              <Link to="/" className="footer__information__list__item__link">
                  <Trans>footer.aboutus</Trans>
              </Link>
            </li>
            <li className="footer__information__list__item">
              <Link to="/" className="footer__information__list__item__link">
                  <Trans>footer.contactus</Trans>
              </Link>
            </li>
            <li className="footer__information__list__item">
              <Link to="/" className="footer__information__list__item__link">
                  <Trans>footer.membership</Trans>
              </Link>
            </li>
            <li className="footer__information__list__item">
              <Link to="/" className="footer__information__list__item__link">
                  <Trans>footer.privatepolicy</Trans>
              </Link>
            </li>
            <li className="footer__information__list__item">
              <Link to="/" className="footer__information__list__item__link">
                  <Trans>footer.support</Trans>
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer__item">
          <h3 className="footer__information"><Trans>footer.posts</Trans></h3>
          <ul className="footer__information__list">
            {props.blogs.map((blog) => (<li className="footer__information__list__item" key={uniqid()}>
              <Link to={`/blogs/${blog.id}`} className="footer__information__list__item__link">
                <span>{blog.title}</span> <span className="footer__information__list__item__link__date">{new Date(blog.date).toLocaleDateString()}</span>
              </Link>
            </li>))}
          </ul>
        </div>
        <div className="footer__item">
          <h3 className="footer__information"><Trans>footer.newstitle</Trans></h3>
          <p className="footer__news__text"><Trans>footer.newstext</Trans></p>
          <form className="footer__news__form">
            <input className="footer__news__form__input" type="email" placeholder="Email"></input>
            <button className="footer__news__form__button" type="submit"></button>
          </form>
        </div>
      </div>
      <div className="footer__copyright">
       <div className="footer__copyright__left">
        <p className="footer__copyright__left__text"><Trans>footer.copyright</Trans></p>
       </div>
       <div className="footer__copyright__right">
        <ul className="footer__copyright__right__list">
          <li className="footer__copyright__right__item">
            <a href="#"><img src={Facebook} width="15px" height="15px"></img></a>
          </li>
          <li className="footer__copyright__right__item">
            <a href="#"><img src={Vk} width="15px" height="15px"></img></a>
          </li>
          <li className="footer__copyright__right__item">
            <a href="#"><img src={Instagram} width="15px" height="15px"></img></a>
          </li>
          <li className="footer__copyright__right__item">
            <a href="#"><img src={Odnoklassniki} width="15px" height="15px"></img></a>
          </li>
        </ul>
       </div>
      </div>
    </footer>
);

Footer.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.date,
    id: PropTypes.string,
  })),
};

export default Footer;
