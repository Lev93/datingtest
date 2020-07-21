import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Swiper from 'react-id-swiper';
import uniqid from 'uniqid';

import 'swiper/css/swiper.css';
import './MainPageBlog.css';
import { Link } from 'react-router-dom';

const MainPageBlog = (props) => {
  const params = {
    slidesPerView: 'auto',
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  return <section className="main-blog">
    <Swiper {...params}>
      {props.blogs.map((blog) => (<div className="main-blog__item" key={uniqid()}>
          <img className="main-blog__item__img" src={blog.img}></img>
          <div className="main-blog__item__conteiner">
            <Link to={`/blogs/${blog.id}`} className='main-blog__item__title'>{blog.title}</Link>
            <p className='main-blog__item__date'>{new Date(blog.date).toLocaleDateString()} | <Trans>blogs.types.{blog.type}</Trans>
            </p>
          </div>
        </div>
      ))}
    </Swiper>
  </section>;
};

MainPageBlog.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.date,
    type: PropTypes.string,
    id: PropTypes.string,
    img: PropTypes.string,
  })),
};

export default MainPageBlog;
