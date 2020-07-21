/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import CommunityTitle from '../../components/CommunityTitle/CommunityTitle';
import AdvancedSearchFields from '../AdvancedSearchFields/AdvancedSearchFields';
import CommunityResults from '../../components/CommunityResults/CommunityResults';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import * as actions from '../../actions';

class Advancedsearch extends Component {
  state = {
    isLoaded: true,
    users: [],
    activPage: 1,
    pages: [1],
    paramsForPage: '',
    sortType: '',
    sortDirections: 'ASC',
  }

  componentDidMount() {
    if (this.props.mapSearchParameters.users.length > 0) {
      this.setState({
        users: this.props.mapSearchParameters.users,
        paramsForPage: this.props.mapSearchParameters.params,
      });
    }
  }

  updateMainState = (parameters) => {
    this.setState({ ...parameters });
  }

  nextPageHandler = () => {
    const data = {
      parameters: this.state.paramsForPage,
      page: this.state.activPage + 1,
      sort: `${this.state.sortType} ${this.state.sortDirections}`,
    };
    axios({
      method: 'post',
      url: './advancedsearch',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      this.setState((prevState) => {
        if (prevState.activPage === prevState.pages[prevState.pages.length - 1]) {
          const newPage = prevState.pages[prevState.pages.length - 1] + 1;
          prevState.pages.push(newPage);
          return { pages: prevState.pages, activPage: newPage };
        }
        return { activPage: prevState.activPage + 1 };
      });
      this.setState({ users: res.data.users });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  pageHandler = (page) => () => {
    const data = {
      parameters: this.state.paramsForPage,
      page,
      sort: `${this.state.sortType} ${this.state.sortDirections}`,
    };
    axios({
      method: 'post',
      url: './advancedsearch',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      this.setState({ activPage: page, users: res.data.users });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  sortHandler = (sort) => () => {
    let dataSort = '';
    let direction = 'ASC';
    if (this.state.sortType === sort) {
      if (this.state.sortDirections === 'ASC') {
        direction = 'DESC';
      }
      dataSort = `${this.state.sortType} ${direction}`;
    } else {
      dataSort = `${sort} ${direction}`;
    }

    const data = {
      parameters: this.state.paramsForPage,
      page: 1,
      sort: dataSort,
    };
    axios({
      method: 'post',
      url: './advancedsearch',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      this.setState({
        activPage: 1,
        pages: [1],
        sortType: sort,
        sortDirections: direction,
      });
      this.setState({ users: res.data.users });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  render() {
    const mainPage = (<React.Fragment>
      <CommunityTitle title={'advancedSearch.title'} subTittle={'advancedSearch.mainTitle'} />
      <AdvancedSearchFields
        updateMainState={this.updateMainState}
        users={this.state.users}
        type={'advanced'}
      />
      <CommunityResults
        users={this.state.users}
        nextPageHandler={this.nextPageHandler}
        pages={this.state.pages}
        activPage={this.state.activPage}
        pageHandler={this.pageHandler}
        sortType={this.state.sortType}
        sortDirections={this.state.sortDirections}
        sortHandler={this.sortHandler}
      />
    </React.Fragment >);
    return this.state.isLoaded ? mainPage : <LoadingScreen />;
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    lng: state.lng,
    mapSearchParameters: state.mapSearchParameters,
  };
  return props;
};

const actionCreators = {
  addError: actions.addError,
};

Advancedsearch.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  mapSearchParameters: PropTypes.shape(),
  addError: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(Advancedsearch);
