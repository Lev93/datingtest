import React from 'react';
import PropTypes from 'prop-types';
import './QuickMatchUsers.css';

const QuickMatchUsers = (props) => (
  <section className="quick-match">
    <ul className="quick-match__users">
      {props.users.map((user) => <li key={user.userId} className="quick-match__users__user">
        <a className="quick-match__users__link" onClick={() => props.userClick(user.id)}>
          <img src={user.avatar} className="quick-match__users__user__img"></img>
        </a>
      </li>)}
    </ul>
  </section>
);

QuickMatchUsers.propTypes = {
  t: PropTypes.func,
  users: PropTypes.array,
  userClick: PropTypes.func,
};

export default QuickMatchUsers;
