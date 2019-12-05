import { combineReducers } from 'redux';
import { auth } from './auth.reducer';
import { users } from './users.reducer';
import { accounts } from './accounts.reducer';
import { businesses, business } from './businesses.reducer';
// import { alert } from './alert.reducer';
const rootReducer = combineReducers({
  auth,
  users,
  accounts,
  businesses,
  business
});

export default rootReducer;
