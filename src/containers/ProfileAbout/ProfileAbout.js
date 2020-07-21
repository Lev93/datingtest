/* eslint-disable no-tabs */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import Dropbox from 'dropbox';
import axios from 'axios';
import { connect } from 'react-redux';
import qs from 'qs';
import Left from '../../assets/strip-half.png';
import './ProfileAbout.css';
import 'swiper/css/swiper.css';
import Button from '../../components/UI/Button/Button';
import Spiner from '../../components/SpinnerSmall/SpinnerSmall';
import ProfileMap from '../ProfileMap/ProfileMap';
import keys from '../../../keys/keys';
import * as actions from '../../actions';

const menuitems = {
  main: [
    {
      name: 'Gender',
      type: 'chooseOne',
      options: ['male', 'female', 'another'],
    },
    {
      name: 'Age',
      type: 'input',
      inputType: 'date',
    },
    {
      name: 'Countries',
      type: 'search',
    },
    {
      name: 'City',
      type: 'input',
      inputType: 'text',
    },
    {
      name: 'Relationship',
      type: 'chooseOne',
      options: ['single', 'maried', 'have'],
    },
    {
      name: 'Lookingfora',
      type: 'chooseOne',
      options: ['man', 'woman', 'friends'],
    },
    {
      name: 'Lookingforageless',
      type: 'input',
      inputType: 'number',
    },
    {
      name: 'Lookingforagemore',
      type: 'input',
      inputType: 'number',
    },
  ],
  activity: [
    {
      name: 'Education',
      type: 'chooseOne',
      options: ['School', 'PhD', 'Univercitydegree', 'College'],
    },
    {
      name: 'Languages',
      type: 'chooseMany',
      options: ['English', 'Russian', 'German', 'French', 'Chinese', 'Ukrainian'],
    },
    {
      name: 'Interests',
      type: 'chooseMany',
      options: ['football', 'pets', 'guitar', 'travel', 'videogames'],
    },
    {
      name: 'Smoking',
      type: 'chooseOne',
      options: ['no', 'sometimes', 'smoke'],
    },
    {
      name: 'Workas',
      type: 'chooseOne',
      options: ['businessman', 'programmer', 'engineer', 'designer', 'teacher', 'policeman'],
    },
  ],
  appearance: [
    {
      name: 'Height',
      type: 'input',
      inputType: 'number',
    },
    {
      name: 'Weight',
      type: 'input',
      inputType: 'number',
    },
    {
      name: 'Bodytype',
      type: 'chooseOne',
      options: ['thick', 'normal', 'thin', 'sport'],
    },
    {
      name: 'Eyes',
      type: 'chooseOne',
      options: ['grey', 'brown', 'green', 'blue'],
    },
    {
      name: 'Hair',
      type: 'chooseOne',
      options: ['long', 'bold', 'verylong', 'normal'],
    },
  ],
};

class ProfileAbout extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.backgroundInput = React.createRef();
    this.photoInput = React.createRef();
    this.state = {
      avatar: {
        status: 'waiting',
        message: '',
      },
      background: {
        status: 'waiting',
        message: '',
      },
      photo: {
        status: 'waiting',
        message: '',
      },
      params: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
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
      },
    };
  }

  descrtiptionItemsRender = (activeMenu) => (
    <ul className="profile-about__description__block__items">
      {menuitems[activeMenu].map((item) => {
        let value;
        if (item.type === 'chooseOne') {
          value = this.props.user[item.name.toLowerCase()] ? <Trans>userPage.{activeMenu}.{item.name}.{this.props.user[item.name.toLowerCase()]}</Trans> : '';
        } else if (item.type === 'chooseMany') {
          value = this.props.user[item.name.toLowerCase()].map((option) => (
            this.props.t(`userPage.${activeMenu}.${item.name}.${option}`)
          )).join(', ');
        } else if (item.type === 'search') {
          value = this.props.user[item.name === 'Countries' ? 'country' : 'city'];
        } else if (item.name === 'Age') {
          value = Math.floor((Date.now() - new Date(this.props.user.birthday)) / 31536000000);
        } else if (item.type === 'file') {
          value = <Trans>userPage.changeAvatar</Trans>;
        } else {
          value = this.props.user[item.name.toLowerCase()];
        }
        return (<li className="profile-about__description__block__item" key={item.name}>
          <p className="profile-about__description__block__item__key">
            <Trans>userPage.{activeMenu}.{item.name}.name</Trans>
          </p>
          {this.props.profile
            ? <React.Fragment>
              <a className="profile-about__description__block__item__value" onClick={this.props.clickHandler(item.name.toLowerCase())}>
                {value || <Trans>userPage.adddescription</Trans>}
              </a>
              {this.props.menuitems[item.name.toLowerCase()] ? <div className="profile-about__description__block__item__value__popup">
                <a className="profile-about__description__block__item__value__popup__close" onClick={this.props.clickHandler(item.name.toLowerCase())}></a>
                {item.type === 'chooseOne' ? this.optionsRender(activeMenu, item) : null}
                {item.type === 'chooseMany' ? this.optionsManyRender(activeMenu, item) : null}
                {item.type === 'search' ? this.searchRender(item) : null}
                {item.type === 'input' ? this.textRender(item) : null}
              </div> : null}
            </React.Fragment>
            : <p className="profile-about__description__block__item__value">
            {value}
            </p>
        }
        </li>);
      })
    }
    </ul>
  );

  textRender = (item) => {
    let { name } = item;
    if (name === 'Age') {
      name = 'birthday';
    }
    return <div className="profile-about__description__block__item__value__popup--wrapper">
      <form className="profile-about__description__block__item__value__popup__form">
        <input
          type={item.inputType}
          value={this.props.text[name]}
          onChange={this.props.textChangeHandler(name.toLowerCase())}>
        </input>
        <Button type={'button'} classes={'confirm'} clicked={this.props.textSubmitHandler(name.toLowerCase())}>userPage.confirm</Button>
      </form>
    </div>;
  };

  searchRender = (item) => (<div className="profile-about__description__block__item__value__popup--wrapper">
      <form className="profile-about__description__block__item__value__popup__form">
        <input type="text" value={this.props.search[item.name.toLowerCase()].value} onChange={this.props.searchChangeHandler(item.name.toLowerCase())}></input>
      </form>
      <ul className="profile-about__description__block__item__value__popup--wrapper--search">
        {this.props.search[item.name.toLowerCase()].results.map(
          (country) => <li key={country.title}
          onClick={
            this.props.searchSubmitHandler(item.name.toLowerCase(), country)
          }>{country.title}
          </li>,
        )}
      </ul>
    </div>);

  optionsManyRender = (activeMenu, item) => <div className="profile-about__description__block__item__value__popup--wrapper">
    <div>
      {item.options.map((option) => {
        const text = `userPage.${activeMenu}.${item.name}.${option}`;
        let classes = 'optionButton';

        if (this.props.user[item.name.toLowerCase()].includes(option)) classes = 'optionButton--active';
        return <Button key = {`${item.name}-${option}`} type={'button'} classes={classes} clicked={this.props.optionManyClickHandler(item.name.toLowerCase(), option)}>{text}</Button>;
      })}
      </div>
      <div className="profile-about__description__block__item__value__popup__button--wrapper">
        <Button type={'button'} classes={'confirm'} clicked={this.props.clickHandler(item.name.toLowerCase())}>userPage.confirm</Button>
      </div>
    </div>;

  optionsRender = (activeMenu, item) => <div className="profile-about__description__block__item__value__popup--wrapper">
      {item.options.map((option) => {
        const text = `userPage.${activeMenu}.${item.name}.${option}`;
        let classes = 'optionButton';
        if (this.props.user[item.name.toLowerCase()] === option) classes = 'optionButton--active';
        return <Button key = {`${item.name}-${option}`} type={'button'} classes={classes} clicked={this.props.optionClickHandler(item.name.toLowerCase(), option)}>{text}</Button>;
      })
    }
    </div>;

  menuItemsRender = (activeMenu) => (<ul className="profile-about__description__menu">
    {Object.keys(menuitems).map((item) => {
      const buttonClasses = ['profile-about__description__item__text', activeMenu === item ? 'profile-about__description__item__text--active' : ''];
      return (<li className="profile-about__description__item" key={item}>
        <a className={buttonClasses.join(' ')} onClick={this.props.menuClick(item)}>
          <Trans>userPage.{item}.title</Trans>
        </a>
      </li>);
    })}
  </ul>);

  descrtiptionItemsBlockRender = (activeMenu) => (<ul className="profile-about__description__blocks">
    {Object.keys(menuitems).map((item) => {
      const blockClass = activeMenu === item ? 'profile-about__description__block' : 'profile-about__description__block--displaynone';
      return (<li className={blockClass} key={`${item}-block`}>
        {this.descrtiptionItemsRender(activeMenu)}
      </li>);
    })}
    </ul>);

  avatarInputChange = (e) => {
    e.preventDefault();
    const oldAvatar = this.state.avatar;
    const file = this.fileInput.current.files[0];
    if (file.size > 1000000) {
      this.props.addError('sizeError');
      this.setState({ avatar: oldAvatar });
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.props.addError('typeError');
      this.setState({ avatar: oldAvatar });
      return;
    }
    oldAvatar.status = 'uploading';
    this.setState({ avatar: oldAvatar });
    const dbx = new Dropbox.Dropbox({ accessToken: keys.dropboxToken });

    dbx.filesUpload({ path: `/${Date.now()}=${file.name}`, contents: file })
      .then((uploadedFile) => {
        dbx.sharingCreateSharedLinkWithSettings({ path: uploadedFile.path_display })
          .then((res) => {
            const avatar = res.url.replace('dl=0', 'raw=1');
            const data = { item: 'avatar', option: avatar, userId: this.props.user.id };
            axios({
              method: 'post',
              url: 'profile/update',
              headers: {
                Authorization: `Bearer ${this.props.user.token}`,
              },
              data: qs.stringify(data),
            }).then(() => {
              this.props.updateUser('avatar', avatar);
              oldAvatar.status = 'succsess';
              this.setState({ avatar: oldAvatar });
            }).catch((err) => {
              this.props.addError(err.response.data.message);
            });
          });
      })
      .catch(() => {
        this.props.addError('imageNetworkProblem');
      });
  }

  backgroundInputChange = (e) => {
    e.preventDefault();
    const oldBackground = this.state.background;
    const file = this.backgroundInput.current.files[0];
    if (file.size > 6000000) {
      this.props.addError('sizeError');
      this.setState({ background: oldBackground });
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.props.addError('typeError');
      this.setState({ background: oldBackground });
      return;
    }
    oldBackground.status = 'uploading';
    this.setState({ background: oldBackground });
    const dbx = new Dropbox.Dropbox({ accessToken: keys.dropboxToken });

    dbx.filesUpload({ path: `/${Date.now()}=${file.name}`, contents: file })
      .then((uploadedFile) => {
        dbx.sharingCreateSharedLinkWithSettings({ path: uploadedFile.path_display })
          .then((res) => {
            const background = res.url.replace('dl=0', 'raw=1');
            const data = { item: 'background', option: background, userId: this.props.user.id };
            axios({
              method: 'post',
              url: 'profile/update',
              headers: {
                Authorization: `Bearer ${this.props.user.token}`,
              },
              data: qs.stringify(data),
            }).then(() => {
              this.props.updateUser('background', background);
              oldBackground.status = 'succsess';
              this.setState({ background: oldBackground });
            }).catch((err) => {
              this.props.addError(err.response.data.message);
            });
          });
      })
      .catch(() => {
        this.props.addError('imageNetworkProblem');
      });
  }

  photoInputChange = (e) => {
    e.preventDefault();
    const oldPhoto = this.state.photo;
    const file = this.photoInput.current.files[0];
    if (file.size > 10000000) {
      this.props.addError('sizeError');
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.props.addError('typeError');
      return;
    }
    oldPhoto.status = 'uploading';
    this.setState({ photo: oldPhoto });
    const dbx = new Dropbox.Dropbox({ accessToken: keys.dropboxToken });

    dbx.filesUpload({ path: `/${Date.now()}=${file.name}`, contents: file })
      .then((uploadedFile) => {
        dbx.sharingCreateSharedLinkWithSettings({ path: uploadedFile.path_display })
          .then((res) => {
            const photo = res.url.replace('dl=0', 'raw=1');
            const data = { photo, userId: this.props.user.id };
            axios({
              method: 'post',
              url: 'profile/addphoto',
              headers: {
                Authorization: `Bearer ${this.props.user.token}`,
              },
              data: qs.stringify(data),
            }).then((response) => {
              this.props.updateUser('photos', response.data.photos);
              oldPhoto.status = 'succsess';
              this.setState({ photo: oldPhoto });
            }).catch((err) => {
              this.props.addError(err.response.data.message);
            });
          });
      })
      .catch(() => {
        this.props.addError('imageNetworkProblem');
      });
  }

  renderPhotos = () => {
    console.log(this.state.photo.status);
    if (this.state.photo.status !== 'waiting' && this.state.photo.status !== 'succsess') {
      return null;
    }
    return <div className={['photo__swiper', this.props.photoOpened ? 'photo__swiper--opened' : 'photo__swiper--closed'].join(' ')}>
      <div className="photos-conteiner__button__conteiner">
        <button className="photos-conteiner__button" onClick={this.props.photoClose}></button>
      </div>
      <div className="photos-conteiner">
        <Swiper {...this.state.params} activeSlideKey = {`photo-${this.props.photoIndex}`}>
          {this.props.user.photos.map((img, i) => (<div className="photo-slide" key={`photo-${i}`}>
            <img className="photo" src={img.image_url}></img>
          </div>))}
        </Swiper>
      </div>
    </div>;
  }

  render() {
    return (<React.Fragment>
      <section className="profile-about">
      <div className="profile-about__description">
        {this.menuItemsRender(this.props.activeMenu)}
        {this.descrtiptionItemsBlockRender(this.props.activeMenu)}
        {this.props.profile
          ? <div className="profile-about__description__aboutme">
              <h4 className="profile-about__description__aboutme__title"><Trans>userPage.changeAvatar</Trans></h4>
              <p><Trans>userPage.avatarUploadDescription</Trans></p>
              <div className="profile-about__avatar__upload__container">
                <form onSubmit={this.avatarSubmit} className="profile-about__avatar__upload__form">
                  <input type="file" onChange={this.avatarInputChange} id="avatar" name="avatar" ref={this.fileInput} className="file__input"/>
                  <label htmlFor="avatar" className="profile-about__avatar__upload__button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
						          <path fill="#fff" d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
					           </svg>
                    <span className="profile-about__avatar__upload__button--text"><Trans>userPage.chooseAvatar</Trans></span>
                  </label>
                </form>
              <div className="profile-about__avatar__upload__messages">
                {this.state.avatar.message === 'sizeError' ? <p className="image-error__text"><Trans>userPage.imageErrors.sizeError</Trans></p> : null}
                {this.state.avatar.message === 'typeError' ? <p className="image-error__text"><Trans>userPage.imageErrors.typeError</Trans></p> : null}
                {this.state.avatar.status === 'uploading' ? <Spiner /> : null}
                {this.state.avatar.status === 'networkError' ? <p className="image-error__text"><Trans>userPage.imageErrors.typeError</Trans></p> : null}
                {this.state.avatar.status === 'succsess' ? <p className="image-error__text"><Trans>userPage.imageErrors.succsess</Trans></p> : null}
              </div>
            </div>
            <div className="profile-about__avatar__upload__container">
              <form onSubmit={this.avatarSubmit} className="profile-about__avatar__upload__form">
                <input type="file" onChange={this.backgroundInputChange} id="background" name="avatar" ref={this.backgroundInput} className="file__input"/>
                <label htmlFor="background" className="profile-about__avatar__upload__button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                    <path fill="#fff" d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                  </svg>
                  <span className="profile-about__avatar__upload__button--text"><Trans>userPage.chooseBackground</Trans></span>
                </label>
              </form>
              <div className="profile-about__avatar__upload__messages">
                {this.state.background.message === 'sizeError' ? <p className="image-error__text"><Trans>userPage.imageErrors.sizeError</Trans></p> : null}
                {this.state.background.message === 'typeError' ? <p className="image-error__text"><Trans>userPage.imageErrors.typeError</Trans></p> : null}
                {this.state.background.status === 'uploading' ? <Spiner /> : null}
                {this.state.background.status === 'networkError' ? <p className="image-error__text"><Trans>userPage.imageErrors.typeError</Trans></p> : null}
                {this.state.background.status === 'succsess' ? <p className="image-error__text"><Trans>userPage.imageErrors.succsess</Trans></p> : null}
              </div>
            </div>
          </div>
          : null }
        <div className="profile-about__description__aboutme">
          <h4 className="profile-about__description__aboutme__title"><Trans>userPage.aboutme</Trans></h4>
          {this.props.profile
            ? <form>
                <textarea type="text" className="profile-about__description__aboutme__input" value={this.props.textarea.aboutme} onChange={this.props.textareaChangeHandler('aboutme')}></textarea>
                <Button classes={'redButton'} type={'submit'} clicked={this.props.submitTextHandler('aboutme')}>userPage.confirm</Button>
              </form>
            : <p className="profile-about__description__aboutme__text">{this.props.user.aboutme}</p>
          }
        </div>
        <div className="profile-about__description__aboutme">
          <h4 className="profile-about__description__aboutme__title"><Trans>userPage.lookingfor</Trans></h4>
          <h5 className="profile-about__description__aboutme__title2">
            {this.props.user.lookingfora
              ? <Trans>userPage.main.Lookingfora.{this.props.user.lookingfora}</Trans> : null} {' '}
            {this.props.user.lookingforagemore ? <React.Fragment>
              <Trans>userPage.main.Lookingforagemore.text</Trans> {' '}
              {this.props.user.lookingforagemore} {' '}</React.Fragment> : null}
            {this.props.user.lookingforageless ? <React.Fragment>
              <Trans>userPage.main.Lookingforageless.text</Trans> {' '}
              {this.props.user.lookingforageless} {' '}
              <Trans>userPage.years</Trans>
              </React.Fragment> : null}
          </h5>
          {this.props.profile
            ? <form>
                <textarea type="text" className="profile-about__description__aboutme__input" value={this.props.textarea.lookingfor} onChange={this.props.textareaChangeHandler('lookingfor')}></textarea>
                <Button classes={'redButton'} type={'submit'} clicked={this.props.submitTextHandler('lookingfor')}>userPage.confirm</Button>
              </form>
            : <p className="profile-about__description__aboutme__text">{this.props.user.lookingfortext}</p>
          }
        </div>
        <div className="profile-about__description__aboutme">
          <h4 className="profile-about__description__aboutme__title"><Trans>userPage.place</Trans></h4>
          {this.props.profile ? <p><Trans>userPage.mapDescription</Trans></p> : null }
          <div className="profile-about__map__conteiner">
            <ProfileMap user={this.props.user} addMarker={this.props.addMarker}/>
          </div>
        </div>
      </div>
      {this.props.match ? null
        : <div className="profile-about__aside-block">
        <div className="profile-about__aside-block__photo">
          <div className="profile-about__aside-block__photo__title__conteiner">
            <h4 className="profile-about__aside-block__photo__title__text"><Trans>userPage.photo</Trans></h4>
            <img src={Left} width="100px" height="11px"></img>
          </div>
          <ul className="profile-about__aside-block__photo__list">
            {this.props.user.photos.map((photo, i) => (<li className="profile-about__aside-block__photo__list__item" key={`${photo.id}^${i}`}>
              <a className="profile-about__aside-block__photo__list__item__a" onClick={this.props.photoClick(i)}>
                <img src={photo.image_url} className="profile-about__aside-block__photo__list__item__image"></img>
              </a>
            </li>))}
            {this.props.profile
              ? <li className="profile-about__aside-block__photo__list__item">
                <form className="profile-about__aside-block__photo__list__item__form" style={{ display: this.state.photo.status === 'uploading' ? 'none' : 'flex' }}>
                  <input type="file" onChange={this.photoInputChange} id="photo" name="photo" ref={this.photoInput} className="file__input"/>
                    <label htmlFor="photo" className="profile-about__photo__upload__button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                        <path fill="#fff" d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                      </svg>
                      <span className="profile-about__photo__upload__button--text"><Trans>userPage.choosePhoto</Trans></span>
                    </label>
                </form>
                {this.state.photo.status === 'uploading' ? <p className="profile-about__aside-block__photo__list__item__a"><Spiner /></p> : null}
                {this.state.photo.message === 'sizeError' ? <p className="profile-about__aside-block__photo__list__item__message"><Trans>userPage.imageErrors.sizeError</Trans></p> : null}
                {this.state.photo.message === 'typeError' ? <p className="profile-about__aside-block__photo__list__item__message"><Trans>userPage.imageErrors.typeError</Trans></p> : null}
                {this.state.photo.status === 'networkError' ? <p className="profile-about__aside-block__photo__list__item__message"><Trans>userPage.imageErrors.typeError</Trans></p> : null}
              </li>
              : null }
          </ul>
        </div>
        <div className="profile-about__aside-block__photo">
          <div className="profile-about__aside-block__photo__title__conteiner">
            <h4 className="profile-about__aside-block__photo__title__text"><Trans>userPage.posts</Trans></h4>
            <img src={Left} width="100px" height="11px"></img>
          </div>
          <ul className="profile-about__aside-block__posts__list">
            {this.props.posts.map((post) => (<li className="profile-about__aside-block__posts__list__post" key={`post-${post.id}`}>
              <div className="profile-about__aside-block__posts__list__post__img-conteiner">
                <img className="photo" src={post.img}></img>
              </div>
              <div className="profile-about__aside-block__posts__list__post__text-conteiner">
                <Link to={`/blogs/${post.id}`} className="profile-about__aside-block__posts__list__post__text">{post.title}</Link>
                <p className="profile-about__aside-block__posts__list__post__date">{new Date(post.date).toLocaleDateString()}</p>
              </div>
            </li>
            ))}
          </ul>
        </div>
      </div>
    }
    </section>
    {this.props.match ? null : this.renderPhotos()}
  </React.Fragment>);
  }
}

const mapStateToProps = (state) => {
  const props = {
    lng: state.lng,
    error: state.error,
  };
  return props;
};

const actionCreators = {
  addError: actions.addError,
};

ProfileAbout.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.string,
    birthday: PropTypes.date,
    country: PropTypes.string,
    city: PropTypes.string,
    aboutme: PropTypes.string,
    lookingfortext: PropTypes.string,
    lookingfora: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.string),
    lookingforageless: PropTypes.string,
    lookingforagemore: PropTypes.string,
    token: PropTypes.string,
  }),
  text: PropTypes.shape(),
  activeMenu: PropTypes.string,
  menuClick: PropTypes.func,
  photoClick: PropTypes.func,
  photoOpened: PropTypes.bool,
  photoClose: PropTypes.func,
  photoIndex: PropTypes.number,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  t: PropTypes.func.isRequired,
  profile: PropTypes.bool,
  clickHandler: PropTypes.func,
  menuitems: PropTypes.shape(),
  optionClickHandler: PropTypes.func,
  search: PropTypes.shape(),
  searchChangeHandler: PropTypes.func,
  textChangeHandler: PropTypes.func,
  textSubmitHandler: PropTypes.func,
  optionManyClickHandler: PropTypes.func,
  searchSubmitHandler: PropTypes.func,
  textareaChangeHandler: PropTypes.func,
  textarea: PropTypes.shape(),
  submitTextHandler: PropTypes.func,
  updateUser: PropTypes.func,
  addMarker: PropTypes.func,
  addError: PropTypes.func,
  match: PropTypes.bool,
};

export default withTranslation()(connect(mapStateToProps, actionCreators)(ProfileAbout));
