import types from '../actions/types';

const DEFAULT_STATE = {
  cellProviders: null,
  cellProvidersMap: {},
  shirtSizes: null,
  shirtSizesMap: {}
};

export default (state = DEFAULT_STATE, { type, ...action }) => {
  switch (type) {
    case types.GET_CELL_PROVIDERS:
      return { ...state, cellProviders: action.providers, cellProvidersMap: action.map };
    case types.GET_SHIRT_SIZES:
      return { ...state, shirtSizes: action.sizes, shirtSizesMap: action.map };
    default:
      return state;
  }
};
