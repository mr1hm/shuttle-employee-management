import axios from '../lib/axios';
import types from './types';
import { throwApiError } from '../lib/redux_functions';

export const adminAddUser = user => async dispatch => {
  try {
    const { data: { userUciNetId } } = await axios.post('/api/admin-add-user.php', user);

    return userUciNetId;
  } catch (error) {
    throwApiError(error, 'Error adding user');
  }
};

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

export const adminGetUserRoles = () => async dispatch => {
  try {
    const { data: { roles, map } } = await axios.get('/api/admin-get-roles.php');

    dispatch({
      type: types.ADMIN_GET_USER_ROLES,
      roles,
      map
    });
  } catch (error) {
    throwApiError(error, 'Error getting user roles');
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
};

export const adminUpdateUser = updates => async dispatch => {
  try {
    const { data: user } = await axios.post('/api/admin-update-user.php', updates);

    dispatch({
      type: types.ADMIN_UPDATE_USER,
      user
    });
  } catch (error) {
    throwApiError(error, 'Error updating user');
  }
};

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

export const getCellProviders = () => async dispatch => {
  try {
    const { data: { providers, map } } = await axios.get('/api/get-cell-providers.php');

    dispatch({
      type: types.GET_CELL_PROVIDERS,
      map,
      providers
    });
  } catch (error) {
    throwApiError(error, 'Error getting cell providers');
  }
};

export const getShirtSizes = () => async dispatch => {
  try {
    const { data: { map, sizes } } = await axios.get('/api/get-shirt-sizes.php');

    dispatch({
      type: types.GET_SHIRT_SIZES,
      map,
      sizes
    });
  } catch (error) {
    throwApiError(error, 'Error getting shirt sizes');
  }
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
