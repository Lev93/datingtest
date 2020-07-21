import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import Left from '../../assets/strip-half.png';
import './UserProfileAbout.css';
import 'swiper/css/swiper.css';

const UserProfileAbout = (props) => {
  const menuitems = {
    main: ['Gender', 'Age', 'Country', 'City', 'Relationship', 'Lookingfora'],
    activity: ['Education', 'Languages', 'Interests', 'Smoking', 'Workas'],
    appearance: ['Height', 'Weight', 'Bodytype', 'Eyes', 'Hair'],
  };

  const descrtiptionItemsRender = (activeMenu) => (
    <ul className="profile-about__description__block__items">
      {menuitems[activeMenu].map((item) => {
        let value = <Trans>userPage.keys.{props.user[item.toLowerCase()]}</Trans>;
        if (item === 'Age') value = Math.floor((Date.now() - props.user.birthday) / 31536000000);
        if (item === 'City') value = props.user.city;
        if (item === 'Languages' || item === 'Interests') {
          value = (<React.Fragment>
            {props.user[item.toLowerCase()].map((el) => <Trans key={el}>userPage.keys.{el}</Trans>)}
          </React.Fragment>);
        }
        if (Number.isFinite(props.user[item.toLowerCase()])) value = props.user[item.toLowerCase()];
        return (<li className="profile-about__description__block__item" key={item}>
          <p className="profile-about__description__block__item__key">
            <Trans>userPage.{activeMenu}.{item}</Trans>
          </p>
          <p className="profile-about__description__block__item__value">
            {value}
          </p>
        </li>);
      })
    }
    </ul>
  );

  const menuItemsRender = (activeMenu) => (<ul className="profile-about__description__menu">
    {Object.keys(menuitems).map((item) => {
      const buttonClasses = ['profile-about__description__item__text', activeMenu === item ? 'profile-about__description__item__text--active' : ''];
      return (<li className="profile-about__description__item" key={item}>
        <a className={buttonClasses.join(' ')} onClick={props.menuClick(item)}>
          <Trans>userPage.{item}.title</Trans>
        </a>
      </li>);
    })}
  </ul>);

  const descrtiptionItemsBlockRender = (activeMenu) => (<ul className="profile-about__description__blocks">
    {Object.keys(menuitems).map((item) => {
      const blockClass = activeMenu === item ? 'profile-about__description__block' : 'profile-about__description__block--displaynone';
      return (<li className={blockClass} key={`${item}-block`}>
        {descrtiptionItemsRender(activeMenu)}
      </li>);
    })}
  </ul>);
  const classes = ['photo__swiper', props.photoOpened ? 'photo__swiper--opened' : 'photo__swiper--closed'];
  const params = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    activeSlideKey: `photo-${props.photoIndex}`,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  };
  return (<React.Fragment>
    <section className="profile-about">
    <div className="profile-about__description">
      {menuItemsRender(props.activeMenu)}
      {descrtiptionItemsBlockRender(props.activeMenu)}
      <div className="profile-about__description__aboutme">
        <h4 className="profile-about__description__aboutme__title"><Trans>userPage.aboutme</Trans></h4>
        <p className="profile-about__description__aboutme__text">{props.user.aboutme}</p>
      </div>
      <div className="profile-about__description__aboutme">
        <h4 className="profile-about__description__aboutme__title"><Trans>userPage.lookingfor</Trans></h4>
        <h5 className="profile-about__description__aboutme__title2">{props.user.lookingforparams}</h5>
        <p className="profile-about__description__aboutme__text">{props.user.lookingfortext}</p>
      </div>
    </div>
    <div className="profile-about__aside-block">
      <div className="profile-about__aside-block__photo">
        <div className="profile-about__aside-block__photo__title__conteiner">
          <h4 className="profile-about__aside-block__photo__title__text"><Trans>userPage.photo</Trans></h4>
          <img src={Left} width="100px" height="11px"></img>
        </div>
        <ul className="profile-about__aside-block__photo__list">
          {props.user.photos.map((photo, i) => (<li className="profile-about__aside-block__photo__list__item" key={photo}>
            <a className="profile-about__aside-block__photo__list__item__a" onClick={props.photoClick(i)}>
              <img src={photo} className="profile-about__aside-block__photo__list__item__image"></img>
            </a>
          </li>))}
        </ul>
      </div>
      <div className="profile-about__aside-block__photo">
        <div className="profile-about__aside-block__photo__title__conteiner">
          <h4 className="profile-about__aside-block__photo__title__text"><Trans>userPage.posts</Trans></h4>
          <img src={Left} width="100px" height="11px"></img>
        </div>
        <ul className="profile-about__aside-block__posts__list">
          {props.posts.map((post) => (<li className="profile-about__aside-block__posts__list__post" key={`post-${post.id}`}>
            <div className="profile-about__aside-block__posts__list__post__img-conteiner">
              <img className="photo" src={post.img}></img>
            </div>
            <div className="profile-about__aside-block__posts__list__post__text-conteiner">
              <Link to={`/blogs/${post.id}`} className="profile-about__aside-block__posts__list__post__text">{post.title}</Link>
              <p className="profile-about__aside-block__posts__list__post__date">{post.date.toLocaleDateString()}</p>
            </div>
          </li>
          ))}
        </ul>
      </div>
    </div>
  </section>

  <div className={classes.join(' ')}>
    <div className="photos-conteiner__button__conteiner">
      <button className="photos-conteiner__button" onClick={props.photoClose}></button>
    </div>
    <div className="photos-conteiner">
      <Swiper {...params}>
        {props.user.photos.map((img, i) => (<div className="photo-slide" key={`photo-${i}`}>
          <img className="photo" src={img}></img>
        </div>))}
      </Swiper>
    </div>
  </div>
</React.Fragment>);
};

UserProfileAbout.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.string,
    birthday: PropTypes.date,
    country: PropTypes.string,
    city: PropTypes.string,
    aboutme: PropTypes.string,
    lookingfortext: PropTypes.string,
    lookingforparams: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.string),
  }),
  activeMenu: PropTypes.string,
  menuClick: PropTypes.func,
  photoClick: PropTypes.func,
  photoOpened: PropTypes.bool,
  photoClose: PropTypes.func,
  photoIndex: PropTypes.number,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
};

export default UserProfileAbout;
