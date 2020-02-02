import { userConstants } from '../constants';
import { userService } from '../services';
import { alertActions } from './';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    getProfile,
    getTransactions,
    redeemReward
};

function redeemReward(user, body) {

    return dispatch => {
        dispatch(request({ body }));
        userService.redeemReward(user, body)
            .then(
                reward => {
                    dispatch(success(reward));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(reward) { return { type: userConstants.REDEEM_REWARD_REQUEST, reward } }
    function success(reward) { return { type: userConstants.REDEEM_REWARD_SUCCESS, reward } }
    function failure(error) { return { type: userConstants.REDEEM_REWARD_FAILURE, error } }
}

function getProfile(token) {

    return dispatch => {
        dispatch(request({ token }));
        userService.getProfile(token)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(t) { return { type: userConstants.GET_PROFILE_REQUEST, t } }
    function success(user) { return { type: userConstants.GET_PROFILE_SUCCESS, user } }
    function failure(error) { return { type: userConstants.GET_PROFILE_FAILURE, error } }
}


function getTransactions(user, publicToken, accountId) {

    return dispatch => {
        dispatch(request({ user }));
        userService.getTransactions(user)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(u) { return { type: userConstants.GET_TRANSACTIONS_REQUEST, u } }
    function success(u) { return { type: userConstants.GET_TRANSACTIONS_SUCCESS, u } }
    function failure(error) { return { type: userConstants.GET_TRANSACTIONS_FAILURE, error } }
}

function register(newUser) {
    return dispatch => {
        dispatch(request({ uesrname: newUser.username }));
        userService.register(newUser)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) {
      return { type: userConstants.LOGIN_SUCCESS, user: JSON.parse(user) } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function getAll() {
    return dispatch => {
        dispatch(request());
        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}
