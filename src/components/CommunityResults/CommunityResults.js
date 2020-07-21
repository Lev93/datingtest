import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import Strip from '../../assets/strip.png';
import './CommunityResults.css';

const calculateAge = (date) => Math.floor((Date.now() - new Date(date)) / 31536000000);
const calculateDuration = (lastOnline) => {
  const difference = Date.now() - new Date(lastOnline);
  if (difference < 3600000) {
    return <React.Fragment>{Math.floor(difference / 60000)}
      <Trans>community.minAgo</Trans>
    </React.Fragment>;
  }
  if (difference < 86400000) {
    return <React.Fragment>{Math.floor(difference / 3600000)}
      <Trans>community.hoursAgo</Trans>
    </React.Fragment>;
  }
  return <React.Fragment>{Math.floor(difference / 86400000)}
    <Trans>community.daysAgo</Trans>
  </React.Fragment>;
};

const CommunityResults = (props) => {
  const renderResults = () => (<React.Fragment>
    {props.users.map((user) => (
      <div className="community-results__results__user" key={user.id}>
        <div className="community-results__results__user__avatar__conteiner">
          <img src={user.avatar} className="community-results__results__user__avatar"></img>
        </div>
        <Link to={`/community/${user.id}`} className="community-results__results__user__name">{user.name}</Link>
        <div className="community-results__results__user__infos">
          <span className="community-results__results__user__info">{calculateAge(user.birthday)}<Trans>MainPage.age</Trans></span>
          <span className="community-results__results__user__info"><Trans>community.city</Trans>{user.city}</span>
          <span className="community-results__results__user__info"><Trans>community.lastonline</Trans>{calculateDuration(user.last_online)}</span>
        </div>
      </div>
    ))}
  </React.Fragment>);
  const sortClasses = (type) => {
    const direction = props.sortDirections === 'ASC' ? 'community-results__sort--asc' : 'community-results__sort--desc';
    return ['community-results__sort',
      type === props.sortType ? 'community-results__sort--active' : '',
      type === props.sortType ? direction : '',
    ].join(' ');
  };


  return <section className="community-results">
    <div className="community-results__title__container">
      <h3 className="community-results__title"><Trans>community.searchResults</Trans></h3>
      <img src={Strip}></img>
    </div>
    <div className="community-results__sort__conteiner">
      <p className="community-results__sort_title"><Trans>community.sort.sortby</Trans></p>
      <a className={sortClasses('created_at')} onClick={props.sortHandler('created_at')}><Trans>community.sort.byregistrationdate</Trans></a>
      <a className={sortClasses('birthday')} onClick={props.sortHandler('birthday')}><Trans>community.sort.byage</Trans></a>
      <a className={sortClasses('last_online')} onClick={props.sortHandler('last_online')}><Trans>community.sort.bylastonline</Trans></a>
    </div>
    <div className="community-results__results">
      {props.users.length > 0 ? renderResults() : <p className="community-results__no-results"><Trans>community.noResults</Trans></p>}
    </div>
    <div className="pages">
      { props.users.length === 0 && props.activPage === 1 ? null
        : props.pages.map((page) => <a key = {`page-${page}`} onClick={props.pageHandler(page)}
            className={page === props.activPage ? 'pages__link--active' : 'pages__link'}>
              {page}
          </a>)}
      {props.users.length === 48 ? <a className="pages__link" onClick={props.nextPageHandler}><Trans>community.next</Trans></a> : null}
    </div>
  </section>;
};

CommunityResults.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  })),
  pages: PropTypes.array,
  activPage: PropTypes.number,
  nextPageHandler: PropTypes.func,
  pageHandler: PropTypes.func,
  sortType: PropTypes.string,
  sortDirections: PropTypes.string,
  sortHandler: PropTypes.func,
};

export default CommunityResults;
