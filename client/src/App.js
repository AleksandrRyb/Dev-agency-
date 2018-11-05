import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';


import Navbar from './components/layOut/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Footer from './components/layOut/Footer';
import Landing from './components/layOut/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/profile/Dashboard';
import CreateProfile from './components/profile/CreateProfile';
import EditProfile from './components/profile/EditProfile';
import AddEducation from './components/credentials/AddEducation';
import AddExperience from './components/credentials/AddExperience';
import Profiles from './components/profiles/Profiles';
import Profile from './components/showProfile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import './App.css';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';
import { logOut } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import store from "./store";

if(localStorage.jwtToken){
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken)
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
    if(decoded.exp < currentTime){
      store.dispatch(logOut());
      store.dispatch(clearCurrentProfile());
      window.location.href = '/login';
    }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className='container'>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/profile/:handle' component={Profile} />
              <Switch>
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/edit-profile' component={EditProfile} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/add-education' component={AddEducation} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/add-experience' component={AddExperience} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/feed' component={Posts} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/posts/:id' component={Post} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
