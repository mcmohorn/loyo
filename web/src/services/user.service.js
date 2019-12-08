
import { authHeader , responseHandler } from '../helpers';


export const userService = {
    login,
    logout,
    register,
    getAll,
    getProfile,
    getTransactions,
};

function getTransactions(user) {

  if (!user || !user.token) return Promise.reject('No token provided');
    const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        },
    };

    return fetch(`/balances`, requestOptions)
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

    return fetch(`/user`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
          console.log('got user profile', user);


            return user;
        });
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
    };

    return fetch(`/login`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
          console.log('user is ', typeof user);
          localStorage.setItem('user', user);
          localStorage.setItem('token', JSON.parse(user).token);
          //console.log('logged in user!', user.token);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            //localStorage.setItem('token', user.token);

            return user;
        });
}

function register(newUser) {
  console.log('new user is ', newUser);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUser.username, password: newUser.password, name: newUser.name })
    };

    return fetch(`/user`, requestOptions)
        .then(responseHandler.handle)
        .then(user => {
          console.log('regiseterd user', user);
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

    return fetch(`/users`, requestOptions).then(responseHandler.handle);
}
