import types from '../actions/types';

const DEFAULT_STATE = {
  auth: false,
  email: null,
  name: null,
  roles: null,
  uciNetId: null
};

export default (state = DEFAULT_STATE, { type, ...action }) => {
  switch (type) {
    case types.TEMP_LOGIN:
      return { ...state, auth: 'pending' };
    case types.USER_LOGIN:
      return { ...state, auth: true, ...action.user };
    case types.USER_LOGOUT:
      return { ...DEFAULT_STATE };
    default:
      return state;
  }
};
