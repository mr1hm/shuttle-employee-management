import types from '../actions/types';

const DEFAULT_STATE = {
  user: null
};

export default (state = DEFAULT_STATE, { type, ...action }) => {
  switch (type) {
    case types.ADMIN_GET_USER_DATA:
      return { ...state, user: action.user };
    case types.USER_LOGOUT:
      return { ...DEFAULT_STATE };
    default:
      return state;
  }
};
