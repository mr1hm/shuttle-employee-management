import types from './types';
import { formatPostData } from '../lib/redux_functions';

export const userLogin = credentials => async dispatch => {
  try {
    const postData = formatPostData(credentials);

    const resp = await fetch('/api/login-page.php', {
      method: 'post',
      body: postData
    });
    const user = await resp.json();

    dispatch({
      type: types.USER_LOGIN,
      user
    });
  } catch (error) {
    return error;
  }
};
