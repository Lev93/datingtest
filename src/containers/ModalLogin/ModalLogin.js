/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Trans, withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import './ModalLogin.css';
import * as actions from '../../actions';
import Close from '../../assets/close-btn.png';

const isInvalid = ({ valid, touched }) => !valid && touched;

class ModalLogin extends Component {
  state = {
    controls: {
      email: {
        id: 'email',
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: this.props.t('login.email'),
        },
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        errorMessage: 'login.emailerror',
        valid: false,
        touched: false,
        label: false,
      },
      password: {
        id: 'password',
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: this.props.t('login.password'),
        },
        value: '',
        validation: {
          required: true,
          minLength: 12,
        },
        errorMessage: 'login.passworderror',
        valid: false,
        touched: false,
        label: false,
      },
    },
    remember: false,
    isFormValid: false,
    error: null,
    errortext: '',
  }

  validateControl=(value, validation) => {
    if (!validation) {
      return true;
    }

    let isValid = true;

    if (validation.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (validation.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (validation.minLength) {
      isValid = value.length >= validation.minLength && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = this.state.controls;
    const updatedControl = updatedControls[controlName];
    updatedControl.value = event.target.value;
    updatedControl.touched = true;
    updatedControl.valid = this.validateControl(event.target.value, updatedControl.validation);
    updatedControls[controlName] = updatedControl;
    let isFormValid = true;
    Object.keys(updatedControls).forEach((name) => {
      isFormValid = updatedControls[name].valid && isFormValid;
    });
    this.setState({ controls: updatedControls, isFormValid });
  }

  rememberme = () => {
    this.setState((prevState) => {
      return { remember: !prevState.remember };
    });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const data = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value,
      remember: this.state.remember,
    };
    axios({
      method: 'post',
      url: '/auth/login',
      data: qs.stringify(data),
    }).then((res) => {
      if (res.data.message) {
        throw new Error(res.data.message);
      }
      this.props.onAddUser({ userId: res.data.userId, token: res.data.token, isAuth: true });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      const remainingMilliseconds = res.data.remember ? 31536000000 : 60 * 60 * 1000;
      const expiryDate = new Date(
        new Date().getTime() + remainingMilliseconds,
      );
      localStorage.setItem('expiryDate', expiryDate.toISOString());
      this.props.setAutoLogout(remainingMilliseconds);
      this.props.close();
    }).catch((err) => {
      console.log(err);
      this.setState({
        errortext: err.message,
        error: true,
        isFormValid: false,
      });
    });
  }

  render() {
    const formElementsArray = Object.keys(this.state.controls);
    return (<div className="modal">
      <div className="modal-login">
        <h4 className="modal__title"><Trans>login.title</Trans></h4>
        <form className="modal__form" onSubmit={this.submitHandler}>
          {formElementsArray.map((input) => {
            return <Input
              key={this.state.controls[input].id}
              id={this.state.controls[input].id}
              elementType={this.state.controls[input].elementType}
              elementConfig={this.state.controls[input].elementConfig}
              value={this.state.controls[input].value}
              label={this.state.controls[input].label}
              inputClassname= {'input__auth'}
              changed={(event) => this.inputChangedHandler(event, this.state.controls[input].id)}
              errorMessage={isInvalid(this.state.controls[input])
                ? this.state.controls[input].errorMessage : null}
              />;
          })}
          <div className="input__container">
            <input type="checkbox" name="remember" id="remember" className="modal-login__remember-checbox" onClick={this.rememberme}></input>
            <label Htmlfor="remember" className="modal-login__remember"><Trans>login.rememberme</Trans></label>
          </div>
          <div className="input__container">
            <Button type="submit" classes="redButton" disabled={!this.state.isFormValid}>login.login</Button>
            {this.state.error ? <p className="error__text"><Trans>{this.state.errortext}</Trans></p> : null}
          </div>
        </form>
        <a className = "modal__close" onClick={this.props.close}><img src={Close}></img></a>
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
  };
  return props;
};

const actionCreators = {
  onAddUser: actions.addUser,
};

ModalLogin.propTypes = {
  t: PropTypes.func.isRequired,
  close: PropTypes.func,
  onAddUser: PropTypes.func,
  setAutoLogout: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(withTranslation()(ModalLogin));
