import { businessConstants, userConstants } from '../constants';

// list is the list of businesses the user owns
// results is the list of search results
export function businesses(state = {list:'[]', error: null, results: []}, action) {
    switch (action.type) {
    case userConstants.LOGOUT:
        state.error = null;
        state.list = '[]';
        return state;
    case businessConstants.GET_BUSINESSES_REQUEST:
        state.error = null
        return state;
    case businessConstants.GET_BUSINESSES_SUCCESS:
        state.error = null;
        state.list = action.businesses;
        return state
    case businessConstants.GET_BUSINESSES_FAILURE:
        state.error = action.error;
          state.list = '[]';
        return state;
    case businessConstants.CREATE_BUSINESS_REQUEST:
        //state.error = null
        return state;
    case businessConstants.CREATE_BUSINESS_SUCCESS:
          const currList = JSON.parse(state.list);
          currList.push(JSON.parse(action.business)) ;
          if (currList.length > 0) {
            state.list = JSON.stringify(currList)
          } else {
            state.list = '[]';
          }
        state.error=null
        return state;
    case businessConstants.CREATE_BUSINESS_FAILURE:
        state.error = action.error
        return state;
    case businessConstants.REMOVE_BUSINESS_REQUEST:
        state.error = null
        return state;
    case businessConstants.REMOVE_BUSINESS_SUCCESS:
        const actionData = JSON.parse(action.r);
        console.log('action.r is ', action, action.r);
        const cl = JSON.parse(state.list).filter(i => { return i.id !== actionData.id });
        state.list = JSON.stringify(cl)
        state.error=null
        return state;
    case businessConstants.REMOVE_BUSINESS_FAILURE:
        state.error = action.error
        return state;
    case businessConstants.UPDATE_BUSINESS_REQUEST:
        state.error = null
        return state;
    case businessConstants.UPDATE_BUSINESS_SUCCESS:
        const b = JSON.parse(action.r);
        const newList = [];
        JSON.parse(state.list).forEach(i => {
            if (i.id === b.id) {
                newList.push(b);
            } else {
                newList.push(i);
            }
        });
        state.list = JSON.stringify(newList);
        state.error=null
        return state;
    case businessConstants.UPDATE_BUSINESS_FAILURE:
        state.error = action.error
        return state;
    case businessConstants.SEARCH_BUSINESSES_REQUEST:
        state.query = action.query;
        return state;
    case businessConstants.SEARCH_BUSINESSES_SUCCESS:
        state.results = JSON.parse(action.results);
        return {error: null, results: JSON.parse(action.results), query:state.query };
    case businessConstants.SEARCH_BUSINESSES_FAILURE:
        state.error = action.error
        return state;
    default:
        return state
    }
}

export function business(state={error: null}, action) {
    switch (action.type){
        case businessConstants.GET_BUSINES_REQUEST:
                state.error = null
                return state;
        case businessConstants.GET_BUSINESS_SUCCESS:
            state = JSON.parse(action.b);
            state.error = null;
            return state;
        case businessConstants.GET_BUSINESS_FAILURE:
            state.error = action.error;
                state.business = {};
            return state;
        default:
            return state;
    }
}
