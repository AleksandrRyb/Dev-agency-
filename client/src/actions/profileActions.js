import axios from 'axios';
import { PROFILE_LOADING, GET_PROFILE, CLEAR_CURRENT_PROFILE, GET_ERRORS, GET_PROFILES } from './types';
import { logOut } from './authActions';

//Loading Profile

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    )
};

export const getProfileByHandle = (handle) => dispatch => {
  dispatch(setProfileLoading());
  axios.get(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    )
};

export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile/all')
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: {}
      })
    )
};

export const createExperience = (newExp, history) => dispatch => {
  axios.post('api/profile/experience', newExp)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }))
}

export const createEducation = (newEdu, history) => dispatch => {
  axios.post('api/profile/education', newEdu)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }))
}

export const deleteExperience = (id) => dispatch => {
  axios.delete(`api/profile/experience/${id}`)
    .then(profile =>
        dispatch({
          type: GET_PROFILE,
          payload: profile.data
          }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }))
}

export const deleteEducation = (id) => dispatch => {
  axios.delete(`api/profile/education/${id}`)
    .then(profile =>
        dispatch({
          type: GET_PROFILE,
          payload: profile.data
          }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }))
}
export const deleteAccount = () => dispatch => {
  if(window.confirm('You lost all data about your account, confirm?')){
    axios.delete('/api/profile')
      .then(res => dispatch(logOut()))

      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        }))
  }
}


export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}

export const createProfile = (profileData, history) => dispatch => {
  axios.post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }))
}
