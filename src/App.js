import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import * as actions from './actions';
import Layout from './hoc/Layout/Layout';
import MainPage from './containers/Mainpage/Mainpage';
import Error404 from './components/Error404/Error404';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import socket from './socket';

const Blogs = React.lazy(() => import('./containers/Blogs/Blogs'));
const BlogSingle = React.lazy(() => import('./containers/BlogSingle/BlogSingle'));
const BlogCreate = React.lazy(() => import('./containers/BlogCreate/BlogCreate'));
const Community = React.lazy(() => import('./containers/Community/Community'));
const Messages = React.lazy(() => import('./containers/Messages/Messages'));
const Advancedsearch = React.lazy(() => import('./containers/Advancedsearch/Advancedsearch'));
const MapSearch = React.lazy(() => import('./containers/MapSearch/MapSearch'));
const QuickMatch = React.lazy(() => import('./containers/QuickMatch/QuickMatch'));
const UserPage = React.lazy(() => import('./containers/UserPage/UserPage'));
const Profile = React.lazy(() => import('./containers/Profile/Profile'));


class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.props.removeUser();
      return;
    }
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    this.props.addUser({ userId, token, isAuth: true });
    if (userId) {
      socket.emit('join', { userId });
      socket.on('new_msg', () => {
        this.props.addMessage();
      });
      const data = { id: userId };
      axios({
        method: 'post',
        url: '/auth/getcoordinates',
        data: qs.stringify(data),
        headers: {
          Authorization: `Bearer ${this.props.user.token}`,
        },
      }).then((res) => {
        this.props.addCity({
          city: res.data.city,
          country: res.data.country,
          lookingfora: res.data.lookingfora,
          lookingforagemore: res.data.lookingforagemore,
          lookingforageless: res.data.lookingforageless,
        });
        this.props.changeCoordinates({ lat: res.data.lat, lng: res.data.lng });
        this.props.updateNewMessages(res.data.newMessages);
      }).catch((err) => {
        console.log(err);
      });
    }

    this.setAutoLogout(remainingMilliseconds);
  }

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.props.removeUser();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('expiryDate');
    }, milliseconds);
  };

  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/blogs" exact render={() => (
          <Suspense fallback={<LoadingScreen />}><Blogs /></Suspense>
        )}/>
        <Route path="/community" exact render={() => (
          <Suspense fallback={<LoadingScreen />}><Community /></Suspense>
        )}/>
        <Route path="/community/:id" render={() => (
          <Suspense fallback={<LoadingScreen />}><UserPage /></Suspense>
        )}/>
        <Route component={Error404} />
      </Switch>
    );
    if (this.props.user.isAuth) {
      routes = (
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/blogs" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><Blogs /></Suspense>
          )}/>
          <Route path="/blogs/create" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><BlogCreate /></Suspense>
          )}/>
          <Route path="/blogs/:id" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><BlogSingle /></Suspense>
          )}/>
          <Route path="/community" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><Community /></Suspense>
          )}/>
          <Route path="/community/advancedsearch" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><Advancedsearch /></Suspense>
          )}/>
          <Route path="/community/mapsearch" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><MapSearch /></Suspense>
          )}/>
          <Route path="/community/mapsearch" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><MapSearch /></Suspense>
          )}/>
          <Route path="/community/quick" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><QuickMatch /></Suspense>
          )}/>
          <Route path="/messages" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><Messages /></Suspense>
          )}/>
          <Route path="/community/:id" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><UserPage /></Suspense>
          )}/>
          <Route path="/profile" exact render={() => (
            <Suspense fallback={<LoadingScreen />}><Profile /></Suspense>
          )}/>
          <Route component={Error404} />
        </Switch>
      );
    }
    return (
        <div>
          <Layout>
            {routes}
          </Layout>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    coordinates: state.coordinates,
  };
  return props;
};

const actionCreators = {
  removeUser: actions.removeUser,
  addUser: actions.addUser,
  changeCoordinates: actions.changeCoordinates,
  addMessage: actions.addMessage,
  updateNewMessages: actions.updateNewMessages,
  addCity: actions.addCity,
};

App.propTypes = {
  user: PropTypes.shape({
    isAuth: PropTypes.bool,
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  removeUser: PropTypes.func,
  addUser: PropTypes.func,
  changeCoordinates: PropTypes.func,
  addMessage: PropTypes.func,
  updateNewMessages: PropTypes.func,
  addCity: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, actionCreators)(App));
