import types from '../actions/types';

const DEFAULT_STATE = {
  user: null
};

export default (state = DEFAULT_STATE, { type, ...action }) => {
  switch (type) {
    case types.ADMIN_GET_USER_DATA:
    case types.ADMIN_UPDATE_USER:
      return { ...state, user: action.user };
    case types.ADMIN_UPDATE_USER_ROLE:
      return { ...state, user: { ...state.user, roles: action.roles } };
    case types.USER_LOGOUT:
      return { ...DEFAULT_STATE };
    default:
      return state;
  }
};
