import { accountConstants, userConstants } from '../constants';

export function accounts(state = {list:'[]', error: null}, action) {
    switch (action.type) {
    case userConstants.LOGOUT:
        state.error = null;
        state.list = '[]';
        return state;
    case accountConstants.GET_ACCOUNTS_REQUEST:
        state.error = null
        return state;
    case accountConstants.GET_ACCOUNTS_SUCCESS:
        state.error = null;
        state.list = action.accounts;
        return state
    case accountConstants.GET_ACCOUNTS_FAILURE:
        state.error = action.error;
          state.list = '[]';
        return state;
    case accountConstants.LINK_ACCOUNT_REQUEST:
        state.error = null
        return state;
    case accountConstants.LINK_ACCOUNT_SUCCESS:
          const currList = JSON.parse(state.list);
          currList.push(JSON.parse(action.account)) ;
          if (currList.length > 0) {
            state.list = JSON.stringify(currList)
          } else {
            state.list = '[]';
          }
        state.error=null
        return state;
    case accountConstants.LINK_ACCOUNT_FAILURE:
        state.error = action.error
        return state;
    case accountConstants.REMOVE_ACCOUNT_REQUEST:
        state.error = null
        return state;
    case accountConstants.REMOVE_ACCOUNT_SUCCESS:
        const actionData = JSON.parse(action.r);
        const cl = JSON.parse(state.list).filter(i => { return i.id !== actionData.id });
        state.list = JSON.stringify(cl)
        state.error=null
        return state;
    case accountConstants.REMOVE_ACCOUNT_FAILURE:
        state.error = action.error
        return state;
    default:
        return state
    }
}
