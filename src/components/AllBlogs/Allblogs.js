import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Left from '../../assets/strip-half.png';
import LeftSmall from '../../assets/categories-list.png';
import './Allblogs.css';

const Allblogs = (props) => {
  const types = ['all', 'news', 'dating', 'success', 'recomendations'];
  const sortClasses = (type) => {
    const direction = props.sortDirections === 'ASC' ? 'community-results__sort--asc' : 'community-results__sort--desc';
    return ['community-results__sort',
      type === props.sortType ? 'community-results__sort--active' : '',
      type === props.sortType ? direction : '',
    ].join(' ');
  };
  return <section className="blogs">
    <div className="blogs__conteiner">
      <div className="blogs__left">
        <div className="blogs__left__categ">
          <h4 className="blogs__left__categ__title"><Trans>blogs.categories</Trans></h4>
          <img src={Left}></img>
          <ul className="blogs__left__categ__list">
            {types.map((el) => {
              const classes = ['blogs__left__categ__list__li',
                props.activeType === el ? 'blogs__left__categ__list__li--active' : ''];
              return <li className={classes.join(' ')} key={el}>
              <a className="blogs__left__categ__list__li__link" onClick={props.changeActiveType(el)}>
                <img className="blogs__left__categ__list__li__img" src={LeftSmall}></img>
                <Trans>blogs.types.{el}</Trans>
              </a>
            </li>;
            })}
          </ul>
        </div>
      </div>
      <div className="blogs__blogs">
        <div className="blogs__blogs__sort">
          <p className="blogs__blogs__sort__text"><Trans>blogs.sort.sortby</Trans></p>
          <a className={sortClasses('views')} onClick={props.sortHandler('views')}><Trans>blogs.sort.views</Trans></a>
          <a className={sortClasses('comments')} onClick={props.sortHandler('comments')}><Trans>blogs.sort.comments</Trans></a>
          <a className={sortClasses('likes')} onClick={props.sortHandler('likes')}><Trans>blogs.sort.likes</Trans></a>
          <a className={sortClasses('date')} onClick={props.sortHandler('date')}><Trans>blogs.sort.date</Trans></a>
        </div>
        <ul className="blogs__blogs__list">
          {props.blogs.map((blog) => <div key={blog.id} className="blogs__blogs__list__blog">
            <div className="blogs__blogs__list__blog__image">
              <img className="blogs__blogs__list__blog__image__img" src={blog.img}></img>
              <div className="blogs__blogs__list__blog__image__info">
                <div className="blogs__blogs__list__blog__image__info__item">
                  <svg fill="#fff" height="15px" viewBox="-21 -47 682.66669 682" width="15px" xmlns="http://www.w3.org/2000/svg">
                    <path d="m552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0"/>
                    <path d="m171.292969 131.171875h297.414062v37.5h-297.414062zm0 0"/>
                    <path d="m171.292969 211.171875h297.414062v37.5h-297.414062zm0 0"/>
                    <path d="m171.292969 291.171875h297.414062v37.5h-297.414062zm0 0"/>
                  </svg>
                  <span>{blog.comments}</span>
                </div>
                <div className="blogs__blogs__list__blog__image__info__item">
                  <svg fill="#fff" height="15px" width="15px" viewBox="0 -28 512.00002 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0"/>
                  </svg>
                  <span>{blog.likes}</span>
                </div>
                <div className="blogs__blogs__list__blog__image__info__item">
                  <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                    <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/>
                  </svg>
                  <span>{blog.views}</span>
                </div>
              </div>
            </div>
            <div className="blogs__blogs__list__blog__desc">
              <h3 className="blogs__blogs__list__blog__desc__title">{blog.title}</h3>
              <div className="blogs__blogs__list__blog__desc__info">
                <Link to={`/community/${blog.user_id}`} className="blogs__blogs__list__blog__desc__info__text">{blog.name}</Link>
                <p className="blogs__blogs__list__blog__desc__info__text">|</p>
                <p className="blogs__blogs__list__blog__desc__info__text">{new Date(blog.date).toLocaleDateString()}</p>
                <p className="blogs__blogs__list__blog__desc__info__text">|</p>
                <p className="blogs__blogs__list__blog__desc__info__text">{blog.type}</p>
              </div>
              <p className="blogs__blogs__list__blog__desc__text">{blog.text}</p>
              <Link to={`/blogs/${blog.id}`} className="blogs__blogs__list__blog__desc__link"><Trans>blogs.readMore</Trans></Link>
            </div>
          </div>)}
          {props.blogs.length === 0 ? <p className="blogs__blogs__sort__text"><Trans>blogs.no</Trans></p> : null}
        </ul>
        <div className="blogs__blogs__pages">
          {props.page === 1 ? null
            : <a className="blogs__blogs__pages__button" onClick={props.nextPage('previous')}>
              <p className="blogs__blogs__pages__button__text"><Trans>blogs.previous</Trans></p>
              <div className="blogs__blogs__pages__button__left">
                <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/>
                </svg>
              </div>
            </a>
          }
          {props.blogs.length < 9 ? null
            : <a className="blogs__blogs__pages__button" onClick={props.nextPage('next')}>
              <div className="blogs__blogs__pages__button__right">
                <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                  <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/>
                </svg>
              </div>
              <p className="blogs__blogs__pages__button__text"><Trans>blogs.next</Trans></p>
            </a>
          }
        </div>
      </div>
    </div>
  </section>;
};

Allblogs.propTypes = {
  blogs: PropTypes.array,
  activeType: PropTypes.string,
  page: PropTypes.number,
  sortDirections: PropTypes.string,
  sortType: PropTypes.string,
  sortHandler: PropTypes.func,
  changeActiveType: PropTypes.func,
  nextPage: PropTypes.func,
};

export default Allblogs;
