import types from '../actions/types';

const DEFAULT_STATE = {
  auth: false
};

export default (state = DEFAULT_STATE, { type, ...action }) => {
  switch (type) {
    default:
      return state;
  }
};
