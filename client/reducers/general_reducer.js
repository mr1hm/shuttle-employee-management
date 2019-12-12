import types from '../actions/types';

const DEFAULT_STATE = {
  cellProviders: null,
  cellProvidersMap: {}
};

export default (state = DEFAULT_STATE, { type, ...action }) => {
  switch (type) {
    case types.GET_CELL_PROVIDERS:
      return { ...state, cellProviders: action.providers, cellProvidersMap: action.map };
    default:
      return state;
  }
};
