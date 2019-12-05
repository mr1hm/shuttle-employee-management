import axios from '../lib/axios';
import types from './types';
import { throwApiError } from '../lib/redux_functions';

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
      dispatch({
        type: types.USER_LOGIN,
        user: data
      });
    } else {
      dispatch({
        type: types.USER_LOGOUT
      });
    }
  }
};

export const userLogin = credentials => async dispatch => {
  try {
    const { data: { token = null, ...user } } = await axios.post('/api/login-page.php', credentials);

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
