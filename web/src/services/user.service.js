
import { authHeader, responseHandler } from '../helpers';


export const userService = {
    login,
    logout,
    register,
    getAll,
    getProfile,
    getTransactions,
    redeemReward
};

function redeemReward(user, reward) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token
        },
        body: JSON.stringify(reward)
    };

    return fetch(`/api/v1/redemption`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
            return user;
        });
}

function getTransactions(user) {

    if (!user || !user.token) return Promise.reject('No token provided');
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
        },
    };

    return fetch(`/api/v1/balances`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
            console.log('got result', user);


            return user;
        });
}



function getProfile(tok) {
    if (!tok) return Promise.reject('No token provided');
    const requestOptions = {
        method: 'GET',
        'Authorization': tok,
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(`/api/v1/user`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
            return user;
        });
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
    };

    return fetch(`api/v1/login`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
            localStorage.setItem('user', user);
            localStorage.setItem('token', JSON.parse(user).token);
            return user;
        });
}

function register(newUser) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUser.username, password: newUser.password, name: newUser.name })
    };

    return fetch(`api/v1/user`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/api/v1/users`, requestOptions).then(responseHandler.handle);
}
