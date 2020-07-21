/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Trans, withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import './ModalReg.css';
import * as actions from '../../actions';
import Close from '../../assets/close-btn.png';

const isInvalid = ({ valid, touched }) => !valid && touched;

class ModalReg extends Component {
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
      name: {
        id: 'name',
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: this.props.t('reg.name'),
        },
        value: '',
        validation: {
          required: true,
          minLength: 3,
        },
        errorMessage: 'reg.nameerror',
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
      passwordrepeat: {
        id: 'passwordrepeat',
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: this.props.t('reg.password'),
        },
        value: '',
        validation: {
          required: true,
          match: true,
        },
        errorMessage: 'reg.passworderror',
        valid: false,
        touched: false,
        label: false,
      },
      gender: {
        id: 'gender',
        elementType: 'select',
        value: 'reg.male',
        label: false,
        elementConfig: {
          options: ['reg.male', 'reg.female'],
        },
        valid: true,
      },
      birthday: {
        id: 'birthday',
        elementType: 'input',
        elementConfig: {
          type: 'date',
          placeholder: this.props.t('reg.birthday'),
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        label: false,
      },
    },
    isFormValid: false,
    error: false,
    errortext: '',
  }

  validateControl=(value, validation, password = 0) => {
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

    if (validation.match) {
      isValid = value === password && isValid;
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
    updatedControl.valid = this.validateControl(event.target.value,
      updatedControl.validation, updatedControls.password.value);
    updatedControls[controlName] = updatedControl;
    let isFormValid = true;
    Object.keys(updatedControls).forEach((name) => {
      isFormValid = updatedControls[name].valid && isFormValid;
    });
    this.setState({ controls: updatedControls, isFormValid });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const data = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value,
      name: this.state.controls.name.value,
      birthday: this.state.controls.birthday.value,
      gender: this.state.controls.gender.value.substring(4),
      lat: this.props.coordinates.lat,
      lng: this.props.coordinates.lng,
    };
    axios({
      method: 'post',
      url: '/auth/registration',
      data: qs.stringify(data),
    }).then(() => {
      this.props.close();
      this.props.showModalLogin();
    }).catch((err) => {
      if (err.message === 'Request failed with status code 422') {
        this.setState({ error: true, errortext: 'reg.erroremail', isFormValid: false });
      } else {
        this.setState({ error: true, errortext: 'reg.errornetwork', isFormValid: false });
      }
    });
  }

  render() {
    const formElementsArray = Object.keys(this.state.controls);
    return (<div className="modal">
      <div className="modal-reg">
        <div className="modal-reg__img"></div>
        <div className="modal-reg__container">
        <h4 className="modal__title"><Trans>reg.title</Trans></h4>
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
            <Button type="submit" classes="redButton" disabled={!this.state.isFormValid}>reg.reg</Button>
            {this.state.error ? <p className="error__text"><Trans>{this.state.errortext}</Trans></p> : null}
          </div>
        </form>
        </div>
        <a className = "modal__close" onClick={this.props.close}><img src={Close}></img></a>
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    lng: state.lng,
    coordinates: state.coordinates,
  };
  return props;
};

const actionCreators = {
  onChangeLanguage: actions.changeLanguage,
};

ModalReg.propTypes = {
  t: PropTypes.func.isRequired,
  close: PropTypes.func,
  showModalLogin: PropTypes.func,
  coordinates: PropTypes.shape(),
};

export default connect(mapStateToProps, actionCreators)(withTranslation()(ModalReg));
