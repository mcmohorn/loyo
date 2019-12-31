import { combineReducers } from 'redux';
import { auth } from './auth.reducer';
import { users } from './users.reducer';
import { accounts } from './accounts.reducer';
import { businesses, business} from './businesses.reducer';
import { newBusiness } from './newBusiness.reducer';
import { currentReward } from './currentReward.reducer';
const rootReducer = combineReducers({
  auth,
  users,
  accounts,
  businesses,
  business,
  newBusiness,
  currentReward
});

export default rootReducer;
