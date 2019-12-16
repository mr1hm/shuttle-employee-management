import { combineReducers } from 'redux';
import adminReducer from './admin_reducer';
import generalReducer from './general_reducer';
import userReducer from './user_reducer';

export default combineReducers({
  admin: adminReducer,
  general: generalReducer,
  user: userReducer
});
