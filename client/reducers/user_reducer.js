import types from '../actions/types';

const DEFAULT_STATE = {
  auth: false,
  email: null,
  name: null,
  profile: null,
  profileError: null,
  roles: null,
  uciNetId: null
};

export default (state = DEFAULT_STATE, { type, ...action }) => {
  switch (type) {
    case types.GET_USER_PROFILE:
      return { ...state, profile: action.profile };
    case types.GET_USER_PROFILE_ERROR:
      return { ...state, profile: null, profileError: action.error };
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
