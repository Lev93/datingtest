/* eslint-disable arrow-body-style */
import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../UI/Button/Button';
import './Blog.css';

const createMarkup = (text) => {
  return { __html: text };
};

const Blog = (props) => {
  return <section className="blog">
    <div className="blog__conteiner">
      <div className="blog__conteiner">
        <div className="blog__title">
          <h3 className="blog__title__text">{props.blog.title}</h3>
          <div className="blog__title__info">
            <Link to={`/community/${props.blog.user_id}`} className="blog__title__info__text">{props.blog.name}</Link>
            <p className="blog__title__info__text">|</p>
            <p className="blog__title__info__text">{new Date(props.blog.date).toLocaleDateString()}</p>
            <p className="blog__title__info__text">|</p>
            <p className="blog__title__info__text">{props.blog.type}</p>
          </div>
          <div className="blog__title__content" dangerouslySetInnerHTML={createMarkup(props.blog.text)}></div>
          <div className="blog__title__bottom">
            <div className="blog__title__bottom__item">
              <svg fill="#fff" height="15px" viewBox="-21 -47 682.66669 682" width="15px" xmlns="http://www.w3.org/2000/svg">
                <path d="m552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0"/>
                <path d="m171.292969 131.171875h297.414062v37.5h-297.414062zm0 0"/>
                <path d="m171.292969 211.171875h297.414062v37.5h-297.414062zm0 0"/>
                <path d="m171.292969 291.171875h297.414062v37.5h-297.414062zm0 0"/>
              </svg>
              <span>{props.blog.comments}</span>
            </div>
            <a className="blog__title__bottom__item" onClick={props.like}>
              <svg fill="#fff" height="15px" width="15px" viewBox="0 -28 512.00002 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0"/>
              </svg>
              <span>{props.blog.likes}</span>
            </a>
            <div className="blog__title__bottom__item">
              <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/>
              </svg>
              <span>{props.blog.views}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="blog__comments">
        <h3 className="blog__comments__title"><Trans>blog.comments</Trans></h3>
        <ul className="blog__comments__list">
          {props.blog.commentsList.map((comment) => {
            return <li key={comment.id} className="blog__comments__list__comment">
              <div className="blog__comments__list__comment__avatar">
                <img src={comment.avatar} className="blog__comments__list__comment__avatar__img"></img>
              </div>
              <div className="blog__comments__list__comment__content">
                <div className="blog__comments__list__comment__content__top">
                  <h4 className="blog__comments__list__comment__content__top__name">{comment.name}</h4>
                  <h5 className="blog__comments__list__comment__content__top__time">{new Date(comment.date).toLocaleString()}</h5>
                </div>
                <p className="blog__comments__list__comment__content__">{comment.text}</p>
              </div>
            </li>;
          })}
        </ul>
      </div>
      <div className="blog__comments__newcomment">
        <h4><Trans>blog.newComment</Trans></h4>
        <form onSubmit={props.leaveComment} className="blog__comments__form">
          <textarea value={props.newComment} type="text" onChange={props.inputHandle} className="blog__comments__newcomment__input"></textarea>
          <Button type={'submit'} classes="redButton">blog.submit</Button>
        </form>
      </div>
    </div>
  </section>;
};

Blog.propTypes = {
  blog: PropTypes.shape,
  leaveComment: PropTypes.func,
  inputHandle: PropTypes.func,
  newComment: PropTypes.string,
  like: PropTypes.func,
};

export default Blog;
