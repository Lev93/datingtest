/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { Link } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import './Messages.css';
import * as actions from '../../actions';
import socket from '../../socket';

const timeFormatter = (time) => {
  let result = '';
  if (Date.now() - time < 86400000) {
    result = time.toLocaleTimeString();
  } else {
    result = time.toLocaleDateString();
  }
  return result;
};

const smilesList = ['😄', '😊', '😃', '😉', '😍', '😘', '😚', '😳', '😌', '😁', '😜', '😝', '😒', '😏', '😓', '😔', '😞', '😱', '😠', '😡', '😪', '😷', '👿', '👫'];

class MainPage extends Component {
  state = {
    isLoaded: false,
    contacts: [],
    activeContact: { empty: true },
    activeContactDates: [],
    chat: '',
    messages: [],
    newMessage: '',
    filter: 'active',
    searchValue: '',
    smiles: false,
  }

  componentDidMount() {
    this.props.hideFooter();
    const sendData = { userId: this.props.user.userId };
    if (this.props.chatParameters.length > 0) {
      sendData.second_user_id = this.props.chatParameters;
    }
    axios({
      method: 'post',
      url: '/messages/',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(sendData),
    }).then((res) => {
      this.setState({ isLoaded: true, contacts: res.data.contacts });
      this.scrollToBottom();
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
    socket.on('new_msg', (data) => {
      this.addMessage(data.message);
    });
    socket.on('new_online', (data) => {
      this.updateOnline(data.userId);
    });
    socket.on('new_offline', (data) => {
      this.updateOffline(data.userId);
    });
    socket.on('input_result', (data) => {
      this.addWriting(data);
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.props.showFooter();
  }

  addWriting = (data) => {
    const updatedContacts = [...this.state.contacts];
    const contactIndex = updatedContacts.findIndex(
      (el) => el.second_user_id === Number.parseInt(data.sender_id, 10),
    );
    if (contactIndex !== -1) {
      updatedContacts[contactIndex].write = data.input;
      this.setState({ contacts: updatedContacts });
      if (this.state.activeContact.second_user_id === data.sender_id) {
        const updatedActiveContact = { ...this.state.activeContact };
        updatedActiveContact.write = data.input;
        this.setState({ activeContact: updatedActiveContact });
      }
    }
  }

  updateOnline = (userId) => {
    const updatedContacts = [...this.state.contacts];
    const contactIndex = updatedContacts.findIndex(
      (el) => el.second_user_id === Number.parseInt(userId, 10),
    );
    if (contactIndex !== -1) {
      updatedContacts[contactIndex].online = 1;
      this.setState({ contacts: updatedContacts });
      if (this.state.activeContact.second_user_id === userId) {
        const updatedActiveContact = { ...this.state.activeContact };
        updatedActiveContact.online = 1;
        this.setState({ activeContact: updatedActiveContact });
      }
    }
  }

  updateOffline = (userId) => {
    const updatedContacts = [...this.state.contacts];
    const contactIndex = updatedContacts.findIndex(
      (el) => el.second_user_id === Number.parseInt(userId, 10),
    );
    if (contactIndex !== -1) {
      updatedContacts[contactIndex].online = 0;
      this.setState({ contacts: updatedContacts });
      if (this.state.activeContact.second_user_id === userId) {
        const updatedActiveContact = { ...this.state.activeContact };
        updatedActiveContact.online = 0;
        updatedActiveContact.last_online = new Date(Date.now().toLocaleString());
        this.setState({ ctiveContact: updatedActiveContact });
      }
    }
  }

  addMessage = (newMessage) => {
    const updatedMessages = [...this.state.messages];
    updatedMessages.push(newMessage);
    const updatedActiveContactDates = [...this.state.activeContactDates];
    updatedActiveContactDates.write = false;
    const newdate = new Date(newMessage.message_created_at).toLocaleDateString();
    if (!updatedActiveContactDates.includes(newdate)) {
      updatedActiveContactDates.push(newdate);
    }
    const updatedContacts = [...this.state.contacts];
    const index = updatedContacts.findIndex((el) => el.second_user_id === newMessage.sender_id);
    updatedContacts[index].last_message = newMessage.message;
    updatedContacts[index].date = newMessage.message_created_at;
    updatedContacts[index].write = false;
    if (newMessage.message === 'blocked') {
      updatedContacts[index].status = 'blocked';
    }
    if (newMessage.message === 'requestAccepted') {
      updatedContacts[index].status = 'active';
    }
    if (this.state.activeContact.second_user_id !== updatedContacts[index].second_user_id) {
      updatedContacts[index].new_messages += 1;
    } else {
      this.props.removeMessages(1);
      const updatedActiveContact = this.state.activeContact;
      if (newMessage.message === 'blocked') {
        updatedActiveContact.status = 'blocked';
        this.setState({ activeContact: updatedActiveContact });
      }
      if (newMessage.message === 'requestAccepted') {
        updatedActiveContact.status = 'active';
        this.setState({ activeContact: updatedActiveContact });
      }
    }
    this.setState({
      messages: updatedMessages,
      contacts: updatedContacts,
      activeContactDates: updatedActiveContactDates,
    });
  };

  openChat = (contact) => () => {
    const dates = [];
    const data = { userId: this.props.user.userId, second_user_id: contact.second_user_id };
    axios({
      method: 'post',
      url: '/messages/messages',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      const { messages } = res.data;
      for (let i = 0; i < messages.length; i += 1) {
        const date = new Date(messages[i].message_created_at).toLocaleDateString();
        dates.push(date);
      }
      const activeContactDates = dates.filter((item, index) => dates.indexOf(item) === index);
      const updatedContacts = [...this.state.contacts];
      const index = updatedContacts.findIndex((el) => el.contact_created_at
          === contact.contact_created_at);
      const oldNewMessages = updatedContacts[index].new_messages;
      this.props.removeMessages(oldNewMessages);
      updatedContacts[index].new_messages = 0;
      this.setState({
        chat: 'visible',
        activeContact: contact,
        messages,
        activeContactDates,
        contacts: updatedContacts,
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  closeContact = () => {
    this.setState({ chat: '', activeContact: { empty: true } });
  }

  changeStatus = (newstatus) => {
    const data = {
      first_user_id: this.state.activeContact.first_user_id,
      second_user_id: this.state.activeContact.second_user_id,
      newstatus,
    };
    axios({
      method: 'post',
      url: '/messages/changestatus',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      let message = 'requestAccepted';
      if (newstatus === 'declined') { message = 'requestDeclined'; }
      if (newstatus === 'blocked') { message = 'blocked'; }
      const oldActiveContact = { ...this.state.activeContact };
      const oldContacts = [...this.state.contacts];
      oldActiveContact.status = newstatus;
      oldActiveContact.last_message = message;
      const index = oldContacts.findIndex((el) => el.contact_created_at
        === oldActiveContact.contact_created_at);
      oldContacts[index].status = newstatus;
      oldContacts[index].last_message = message;
      const updatedMessages = [...this.state.messages];
      const newMessage = res.data.message;
      updatedMessages.push(newMessage);
      this.setState({
        activeContact: oldActiveContact,
        contacts: oldContacts,
        messages: updatedMessages,
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  inputChange = (e) => {
    if (e.target.value.length === 1) {
      socket.emit('input', { sender_id: this.props.user.userId, receiver_id: this.state.activeContact.second_user_id, status: true });
    }
    if (e.target.value.length === 0) {
      socket.emit('input', { sender_id: this.props.user.userId, receiver_id: this.state.activeContact.second_user_id, status: false });
    }
    this.setState({ newMessage: e.target.value });
  }

  seachContactsInput = (e) => {
    this.setState({ searchValue: e.target.value });
  }

  searchContacts = () => {
    const data = {
      userId: this.props.user.userId,
      searchValue: this.state.searchValue,
    };
    axios({
      method: 'post',
      url: '/messages/searchContacts/',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      this.setState({ contacts: res.data.contacts, searchValue: '' });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  sendMessage = () => {
    if (this.state.newMessage.length < 0) return;
    const data = {
      sender_id: this.props.user.userId,
      receiver_id: this.state.activeContact.second_user_id,
      message: this.state.newMessage,
    };
    axios({
      method: 'post',
      url: '/messages/newmessage/',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      const newMassage = res.data.message;
      this.setState((prevState) => {
        const updatedMessages = [...prevState.messages];
        updatedMessages.push(newMassage);
        const updatedContacts = [...prevState.contacts];
        const index = updatedContacts.findIndex(
          (el) => el.second_user_id === newMassage.receiver_id,
        );
        updatedContacts[index].last_message = newMassage.message;
        updatedContacts[index].date = newMassage.message_created_at;
        return {
          messages: updatedMessages,
          contacts: updatedContacts,
          newMessage: '',
        };
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  contactsFilter = (e) => {
    const filter = e.target.value;
    const sendData = { userId: this.props.user.userId, filter };
    axios({
      method: 'post',
      url: '/messages/filter',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(sendData),
    }).then((res) => {
      this.setState({ isLoaded: true, contacts: res.data.contacts, filter });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  openSmiles = () => {
    this.setState((prevState) => {
      return { smiles: !prevState.smiles };
    });
  }

  closeSmeiles = () => {
    this.setState((prevState) => {
      return { smiles: !prevState.smiles };
    });
  }

  addSmile = (smile) => {
    this.setState((prevState) => {
      const oldMessage = prevState.newMessage;
      const newMessage = oldMessage.concat(smile);
      return { newMessage };
    });
  }

  renderMessage = (message) => {
    let messageStatus = false;
    if (message.message === 'request sent') messageStatus = true;
    if (message.message === 'requestAccepted') messageStatus = true;
    if (message.message === 'requestDeclined') messageStatus = true;
    if (message.message === 'blocked') messageStatus = true;
    const messageClass = ['messages__text__main__conteiner__maessages-block__message',
      message.sender_id === Number.parseInt(this.props.user.userId, 10) ? 'self' : '',
      messageStatus ? 'automatic' : '',
    ];
    let finalMessage = <span><Trans>messages.status.{message.message}</Trans></span>;
    if (message.message === 'request sent' && message.receiver_id === Number.parseInt(this.props.user.userId, 10)) {
      finalMessage = <div>
        <p><Trans>messages.status.request</Trans></p>
        {this.state.activeContact.status === 'request waiting'
          ? <div className="dialog__button__wrapper">
            <button className="dialog__button accept" onClick={() => this.changeStatus('active')}><Trans>messages.status.accept</Trans></button>
            <button className="dialog__button decline" onClick={() => this.changeStatus('declined')}><Trans>messages.status.decline</Trans></button>
          </div>
          : null}
      </div>;
    } else if (message.message === 'blocked' && message.sender_id === Number.parseInt(this.props.user.userId, 10)) {
      finalMessage = <div>
        <p><Trans>messages.status.blocked</Trans></p>
        {this.state.activeContact.status === 'blocked' && this.state.messages[this.state.messages.length - 1].sender_id === Number.parseInt(this.props.user.userId, 10)
          ? <div className="dialog__button__wrapper">
            <button className="dialog__button accept" onClick={() => this.changeStatus('active')}><Trans>messages.status.restore</Trans></button>
          </div>
          : null}
      </div>;
    } else if (message.message === 'blocked' && message.receiver_id === Number.parseInt(this.props.user.userId, 10)) {
      finalMessage = <div>
        <p><Trans>messages.status.blockedByUser</Trans></p>
      </div>;
    } else if (message.message === 'requestDeclined' && message.sender_id === Number.parseInt(this.props.user.userId, 10)) {
      finalMessage = <p><Trans>messages.status.requestDeclinedUser</Trans></p>;
    } else if (message.message === 'requestAccepted' && message.sender_id === Number.parseInt(this.props.user.userId, 10)) {
      finalMessage = <p><Trans>messages.status.requestAcceptedUser</Trans></p>;
    }
    return <div className={messageClass.join(' ')} key={`message-${message.message_id}`}>
      <div className="messages__text__main__conteiner__maessages-block__message__wrapper">
        {messageStatus ? finalMessage : <span>{message.message}</span>}
      </div>
      <div className="messages__text__main__conteiner__maessages-block__message__time">
        <span>{new Date(message.message_created_at).toLocaleTimeString()}</span>
      </div>
    </div>;
  }

  renderMessages = () => {
    return <React.Fragment>
      {this.state.activeContactDates.map((date) => {
        let datetitle = date;
        if (date === new Date().toLocaleDateString()) { datetitle = <Trans>messages.today</Trans>; }
        if (date === new Date(Date.now() - 86400000).toLocaleDateString()) {
          datetitle = <Trans>messages.yesterday</Trans>;
        }
        const dateMassages = this.state.messages.filter(
          (message) => new Date(message.message_created_at).toLocaleDateString() === date,
        );
        return <div key={date} className="messages__text__main__conteiner__maessages-block">
          <div className="messages__text__main__conteiner__maessages-block__date">{datetitle}</div>
          {dateMassages.map((message) => {
            return this.renderMessage(message);
          })}
        </div>;
      })}
      {this.state.activeContact.write ? <div className="messages__text__main__conteiner__maessages-block">
          <div className="messages__text__main__conteiner__maessages-block__message  automatic">
            <div className="messages__text__main__conteiner__maessages-block__message__wrapper">
              <span><Trans>messages.writing</Trans></span>
            </div>
          </div>
        </div>
        : null}
    </React.Fragment>;
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const mainPage = (<section className="messages">
      <div className="messages__contacts">
        <div className="messages__contacts__header">
          <div className="messages__contacts__header__title-container">
            <h5 className="messages__contacts__header__title"><Trans>messages.title</Trans></h5>
          </div>
          <div className="messages__contacts__header__undertitle-container">
            <select className="messages__contacts__header__undertitle__select" onChange={this.contactsFilter} value={this.state.filter}>
              <option value="active">{this.props.t('messages.filter.active')}</option>
              <option value="all">{this.props.t('messages.filter.all')}</option>
              <option value="unread">{this.props.t('messages.filter.unread')}</option>
              <option value="declined">{this.props.t('messages.filter.blocked')}</option>
              <option value="request waiting">{this.props.t('messages.filter.new')}</option>
              <option value="request sent">{this.props.t('messages.filter.usersRequests')}</option>
            </select>
            <div className="messages__contacts__header__undertitle__search">
              <input type="text" className="messages__contacts__header__undertitle__search__input"
              placeholder={this.props.t('messages.searchplaceholder')} value={this.state.searchValue} onChange={this.seachContactsInput}></input>
              <div className="messages__contacts__header__undertitle__search__button" onClick={this.searchContacts}>
                <svg className="messages__contacts__header__undertitle__search__button__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <ul className="messages__contacts__list">
          {this.state.contacts.map((contact) => {
            const itemClasses = ['messages__contacts__list__item'];
            const avatarClasses = ['messages__contacts__list__item__link__avatar',
              contact.second_user_id === this.state.activeContact.second_user_id && contact.online ? 'messages__contacts__list__item__link__avatar--active-online' : '',
              contact.second_user_id === this.state.activeContact.second_user_id && !contact.online ? 'messages__contacts__list__item__link__avatar--active-offline' : '',
              contact.second_user_id !== this.state.activeContact.second_user_id && contact.online ? 'messages__contacts__list__item__link__avatar--notactive-online' : '',
              contact.second_user_id !== this.state.activeContact.second_user_id && !contact.online ? 'messages__contacts__list__item__link__avatar--notactive-offline' : '',
              contact.status !== 'active' ? 'messages__contacts__list__item__link__avatar--blocked' : '',
            ];
            let message = contact.last_message;
            if (contact.last_message === 'request sent' && contact.status === 'request waiting') { message = <Trans>messages.status.request</Trans>; }
            if (contact.last_message === 'request sent' && contact.status === 'request sent') { message = <Trans>messages.status.request sent</Trans>; }
            if (contact.last_message === 'requestAccepted') { message = <Trans>messages.status.requestAccepted</Trans>; }
            if (contact.last_message === 'requestDeclined') { message = <Trans>messages.status.requestDeclined</Trans>; }
            if (contact.last_message === 'blocked') { message = <Trans>messages.status.blocked</Trans>; }
            if (contact.write) { message = <Trans>messages.writing</Trans>; }
            return <li className={itemClasses.join(' ')} key={`contact-${contact.contact_id}`}>
              <a className="messages__contacts__list__item__link" onClick={this.openChat(contact)}>
                <div className={avatarClasses.join(' ')}>
                  <img src={contact.avatar} className="messages__contacts__list__item__link__avatar__img"></img>
                </div>
                <div className="messages__contacts__list__item__link__content">
                  <div className="messages__contacts__list__item__link__content__info">
                    <h6 className="messages__contacts__list__item__link__content__info__name">{contact.name}</h6>
                    <div className="messages__contacts__list__item__link__content__info__time">{contact.date ? timeFormatter(new Date(contact.date)) : timeFormatter(new Date(contact.contact_created_at))}</div>
                  </div>
                  <div className="messages__contacts__list__item__link__content__text">
                   <p className={['messages__contacts__list__item__link__content__text__p',
                     contact.new_messages > 0 ? 'messages__contacts__list__item__link__content__text__p__black' : ''].join(' ')}>{message}</p>
                   {contact.new_messages > 0
                     ? <div className="messages__contacts__list__item__link__content__text__new">{contact.new_messages}</div>
                     : null }
                  </div>
                </div>
              </a>
            </li>;
          })}
          { this.state.contacts.length === 0 ? <li>
            <Trans>messages.contactsNone</Trans>
          </li> : null }
        </ul>
      </div>
      <div className={['messages__text', this.state.chat].join(' ')}>
        <div className="messages__text__header">
          <button type="button" className="messages__text__header__back" onClick={this.closeContact}>
            <svg className="messages__text__header__back__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
          <div className="messages__text__header__name">
            <div className={['messages__contacts__list__item__link__avatar',
              this.state.activeContact.online ? 'messages__contacts__list__item__link__avatar--notactive-online' : 'messages__contacts__list__item__link__avatar--notactive-offline',
            ].join(' ')}>
              <img src={this.state.activeContact.avatar} className="messages__contacts__list__item__link__avatar__img"></img>
            </div>
            <div className="messages__text__header__name__nameonline">
              <h6 className="messages__text__header__name__name"><Link to={`/community/${this.state.activeContact.second_user_id}`} className="messages__text__header__name__name__link">{this.state.activeContact.name}</Link></h6>
              {this.state.activeContact.name
                ? this.state.activeContact.online === 1 ? <small className="messages__text__header__name__online">Online</small> : <small className="messages__text__header__name__online"><Trans>messages.wasOnline</Trans> {new Date(this.state.activeContact.last_online).toLocaleDateString()}</small>
                : null}
            </div>
          </div>
          <div className="messages__text__header__name__blockButton_container">
            {this.state.activeContact.status === 'active'
              ? <a className="messages__text__header__name__blockButton" onClick={() => this.changeStatus('blocked')}><Trans>messages.block</Trans></a>
              : null }
          </div>
        </div>
        <div className="messages__text__main">
          <div className="messages__text__main__conteiner">
            {this.renderMessages()}
            <div style={{ float: 'left', clear: 'both' }}
             ref={(el) => { this.messagesEnd = el; }}>
            </div>
          </div>
        </div>
        <div className="messages__text__footer">
          <div className="messages__text__footer__conteiner">
            <div className="messages__text__footer__input-block">
              <button type="button" className="messages__text__footer__input-block__button" disabled={this.state.activeContact.status !== 'active'}>
              <svg className="messages__text__footer__input-block__button__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              </button>
              <button type="button" className="messages__text__footer__input-block__button" disabled={this.state.activeContact.status !== 'active'} onClick={this.openSmiles}>
                <svg className="messages__text__footer__input-block__button__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              {this.state.smiles
                ? <div className="smiles__conteiner">
                  <ul className="smiles">
                    {smilesList.map((smile) => <li key={smile} className="smiles_smile" onClick={() => this.addSmile(smile)}>{smile}</li>)}
                  </ul>
                </div>
                : null}
              {this.state.smiles ? <div className="messages-backdrop" onClick={this.closeSmeiles}></div> : null }
              <textarea className="messages__text__footer__input-block__textarea"
                placeholder={this.props.t('messages.write')}
                disabled={this.state.activeContact.status !== 'active'}
                onChange={this.inputChange}
                value={this.state.newMessage}
                >
              </textarea>
              <button type="button" className="messages__text__footer__input-block__send" disabled={this.state.activeContact.status !== 'active'} onClick={this.sendMessage}>
                <svg className="messages__text__footer__input-block__send__svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
       </div>
      </div>
    </section>);
    return this.state.isLoaded ? mainPage : <LoadingScreen />;
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    chatParameters: state.chatParameters,
  };
  return props;
};

const actionCreators = {
  addError: actions.addError,
  showFooter: actions.showFooter,
  hideFooter: actions.hideFooter,
  removeMessages: actions.removeMessages,
};

MainPage.propTypes = {
  t: PropTypes.func,
  user: PropTypes.shape({
    userId: PropTypes.number,
    token: PropTypes.string,
  }),
  addError: PropTypes.func,
  chatParameters: PropTypes.string,
  showFooter: PropTypes.func,
  hideFooter: PropTypes.func,
  removeMessages: PropTypes.func,
};

export default withTranslation()(connect(mapStateToProps, actionCreators)(MainPage));
