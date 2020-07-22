/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import './PromoSearch.css';
import * as actions from '../../actions';

const formatDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;
  const yy = date.getFullYear();
  return `${yy}-${mm}-${dd}`;
};

class PromoSearch extends Component {
  state = {
    controls: {
      sex: {
        id: 'sex',
        elementType: 'select',
        value: 'mapSearch.man',
        label: 'MainPage.iama',
        elementConfig: {
          options: ['MainPage.man', 'MainPage.woman'],
        },
      },
      genderMain: {
        id: 'genderMain',
        elementType: 'select',
        value: 'mapSearch.woman',
        label: 'MainPage.seeking',
        elementConfig: {
          options: ['mapSearch.man', 'mapSearch.woman'],
        },
      },
      from: {
        id: 'from',
        elementType: 'input',
        value: 20,
        label: 'MainPage.from',
        elementConfig: {
          type: 'number',
        },
      },
      to: {
        id: 'to',
        elementType: 'input',
        value: 40,
        label: 'MainPage.to',
        elementConfig: {
          type: 'number',
        },
      },
    },
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = this.state.controls;
    updatedControls[controlName].value = event.target.value;
    this.setState({ controls: updatedControls });
  }

  search = (e) => {
    e.preventDefault();
    if (!this.props.user.isAuth) {
      this.props.addError('notAuthenticated');
      return;
    }
    const controls = { ...this.state.controls };
    const parametersArray = [];
    if (controls.genderMain.value === 'mapSearch.woman') {
      parametersArray.push('gender = "female"');
    } else {
      parametersArray.push('gender = "male"');
    }
    if (controls.from.value !== '') {
      const birthadayfrom = new Date(Date.now());
      birthadayfrom.setFullYear(birthadayfrom.getFullYear() - controls.from.value);
      const formatedFrom = formatDate(birthadayfrom);
      parametersArray.push(`birthday <= "${formatedFrom}"`);
    }
    if (controls.to.value !== '') {
      const birthadayfrom = new Date(Date.now());
      birthadayfrom.setFullYear(birthadayfrom.getFullYear() - controls.to.value);
      const formatedFrom = formatDate(birthadayfrom);
      parametersArray.push(`birthday >= "${formatedFrom}"`);
    }

    const parameters = parametersArray.join(' AND ');

    const data = {
      parameters, page: 1, sort: 'created_at',
    };
    axios({
      method: 'post',
      url: '/community/advancedsearch',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      this.props.addMapParameters({
        users: res.data.users,
        parameters: controls,
        params: parameters,
      });
      this.props.history.push('/community/advancedsearch');
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  render() {
    const formElementsArray = Object.keys(this.state.controls);
    return (
      <div className="promo__search__container">
        <form className="promo__search">
          {formElementsArray.map((input) => {
            return <Input
            key={this.state.controls[input].id}
            id={this.state.controls[input].id}
            elementType={this.state.controls[input].elementType}
            elementConfig={this.state.controls[input].elementConfig}
            value={this.state.controls[input].value}
            label={this.state.controls[input].label}
            changed={(event) => this.inputChangedHandler(event, this.state.controls[input].id)} />;
          })}
          <Button type="submit" classes="redButton" clicked={this.search}>MainPage.search</Button>
        </form>
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
  addMapParameters: actions.addMapParameters,
  addError: actions.addError,
};

PromoSearch.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    token: PropTypes.string,
  }),
  addMapParameters: PropTypes.func,
  history: PropTypes.shape,
  addError: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(withRouter(PromoSearch));
