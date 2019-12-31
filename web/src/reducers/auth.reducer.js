import { userConstants } from '../constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function auth(state = initialState, action) {
    switch (action.type) {
    case userConstants.LOGIN_REQUEST:
        return {
        loggingIn: true,
        user: action.user
        };
    case userConstants.LOGIN_SUCCESS:
        return {
        loggedIn: false,
        user: action.user,
        redirect: "/",
        };
    case userConstants.REGISTER_SUCCESS:
        return {
        loggedIn: false,
        user: action.user,
        redirect: "/login",
        };
    case userConstants.GET_TRANSACTIONS_FAILURE:
        return {
        error: action.error
        };

    case userConstants.GET_TRANSACTIONS_SUCCESS:
        const user = {
            ...state.user,
            balances: JSON.parse(action.u)
        };
        return {
        user,
        };
    case userConstants.LOGIN_FAILURE:
        return {};
    case userConstants.LOGOUT:
        return {
          redirect: "/login",
        };
    default:
        return state
    }
}
