import axios from '../lib/axios';
import types from './types';
import { throwApiError } from '../lib/redux_functions';

export const adminGetUserData = uciId => async dispatch => {
  try {
    const { data: user } = await axios.get(`/api/admin-get-user.php?uciId=${uciId}`);

    dispatch({
      type: types.ADMIN_GET_USER_DATA,
      user
    });
  } catch (error) {
    throwApiError(error, 'Error getting user\'s data');
  }
};

export const adminSetUserRole = (role, uciId) => async dispatch => {
  try {
    const { data: roles } = await axios.post('/api/admin-set-user-role.php', { role, uciId });

    dispatch({
      type: types.ADMIN_UPDATE_USER_ROLE,
      roles
    });
  } catch (error) {
    throwApiError(error, 'Error updating user role');
  }
}

export const onLoadCheckAuth = async dispatch => {
  const token = localStorage.getItem('uciToken') || null;
  if (document.cookie.indexOf('PHPSESSID') !== -1 || token) {
    dispatch({ type: types.TEMP_LOGIN });

    const headers = {};

    if (token) {
      headers['X-Access-Token'] = token;
    }

    const { data } = await axios.get('/api/on_load_auth_check.php', { headers });

    if (data) {
      return dispatch({
        type: types.USER_LOGIN,
        user: data
      });
    }
  }

  dispatch({
    type: types.USER_LOGOUT
  });
};

export const getUserData = () => async dispatch => {
  try {
    const { data } = await axios.get('/api/user-info.php');

    dispatch({
      type: types.GET_USER_PROFILE,
      profile: data
    });
  } catch (error) {
    dispatch({
      type: types.GET_USER_PROFILE_ERROR,
      error: 'Error loading user profile'
    });
  }
};

export const userLogin = credentials => async dispatch => {
  try {
    const { data: { token = null, ...user } } = await axios.post('/api/user-login.php', credentials);

    if (token) {
      localStorage.setItem('uciToken', token);
    }

    dispatch({
      type: types.USER_LOGIN,
      user
    });
  } catch (error) {
    throwApiError(error, 'Error logging in');
  }
};

export const userLogout = () => async dispatch => {
  try {
    await axios.get('/api/user-logout.php');

    localStorage.removeItem('uciToken');

    dispatch({
      type: types.USER_LOGOUT
    });
  } catch (error) {
    throwApiError(error, 'Error logging out');
  }
};
