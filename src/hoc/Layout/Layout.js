/* eslint-disable arrow-body-style */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalLayout from '../ModalLayout/ModalLayout';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import * as actions from '../../actions';

class Layout extends Component {
  state = {
    mainMenu: false,
    modalLoginIsOpen: false,
    modalRegIsOpen: false,
    modalError: false,
    blogs: [],
    errorText: '',
  }

  componentDidMount() {
    const { short } = this.props.lng;
    const data = {
      lng: short,
    };
    axios({
      method: 'post',
      url: '/blogs/getnewblogs',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
      data: qs.stringify(data),
    }).then((res) => {
      this.setState({
        blogs: res.data.blogs,
      });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error) {
      this.setState({ modalError: true, errorText: this.props.error });
    }
  }

  MenuButtonClick = () => {
    this.setState((prevState) => {
      return { mainMenu: !prevState.mainMenu };
    });
  }

  closeMenu = () => {
    this.setState({ mainMenu: false });
  }

  onChangeLanguage = (event) => {
    const { onChangeLanguage } = this.props;
    onChangeLanguage(event.target.value);
  }

  showModalLogin = () => {
    this.setState({ modalLoginIsOpen: true });
  };

  showModalReg = () => {
    this.setState({ modalRegIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalLoginIsOpen: false, modalRegIsOpen: false, modalError: false });
  };

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.props.removeUser();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('expiryDate');
    }, milliseconds);
  };

  logout = () => {
    this.props.removeUser();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiryDate');
    this.setState({ mainMenu: false });
    this.props.history.push('/');
  }

  render() {
    return (
      <React.Fragment>
        <ModalLayout
        modalLoginIsOpen={this.state.modalLoginIsOpen}
        modalRegIsOpen={this.state.modalRegIsOpen}
        modalErrorIsOpen={this.state.modalError}
        closeModal={this.closeModal}
        showModalLogin={this.showModalLogin}
        setAutoLogout={this.setAutoLogout}
        errorText={this.state.errorText}
        >
          <Header
            isAuth={this.props.user.isAuth}
            MenuButtonClick={this.MenuButtonClick}
            mainMenu={this.state.mainMenu}
            language={this.props.lng.full}
            onChangeLanguage={this.onChangeLanguage}
            showModalLogin={this.showModalLogin}
            showModalReg={this.showModalReg}
            logout={this.logout}
            newMessages={this.props.newMessages}
            closeMenu={this.closeMenu}
          />
          {this.props.children}
          {this.props.footer ? <Footer blogs={this.state.blogs}/> : null}
        </ModalLayout>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    lng: state.lng,
    user: state.user,
    error: state.error,
    footer: state.footer,
    newMessages: state.newMessages,
  };
  return props;
};

const actionCreators = {
  onChangeLanguage: actions.changeLanguage,
  removeUser: actions.removeUser,
  addError: actions.addError,
};

Layout.propTypes = {
  children: PropTypes.node,
  lng: PropTypes.shape({
    full: PropTypes.string,
    short: PropTypes.string,
  }),
  onChangeLanguage: PropTypes.func,
  removeUser: PropTypes.func,
  user: PropTypes.shape({
    isAuth: PropTypes.bool,
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  changeCoordinates: PropTypes.func,
  error: PropTypes.string,
  footer: PropTypes.bool,
  newMessages: PropTypes.number,
  history: PropTypes.shape(),
  addError: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, actionCreators)(Layout));
