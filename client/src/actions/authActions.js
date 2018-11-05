import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';


export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        }))
}

export const loginUser = userData => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      //Create const for jwt
      const { token } = res.data;
      // Set to local storage
      localStorage.setItem('jwtToken', token);
      //Set token to atuh header
      setAuthToken(token);
      //Decode user data from jwt token an set current user
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        }))
}

//Set logged in user

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

//Log out user

export const logOut = () => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
}
