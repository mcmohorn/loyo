import config from 'config';
import { authHeader } from '../helpers';

export const userService = {
    login,
    logout,
    register,
    getAll
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
    };

    return fetch(`/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
          console.log('logged in user!', user);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function register(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
    };

    return fetch(`/register`, requestOptions)
        .then(handleResponse)
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
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
      let data = text;
      console.log('text is ', text);

        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            //const error = (data && data.message) || response.statusText;
            return Promise.reject(text);
        } else {
          const data = text && JSON.parse(text);
        }

        return data;
    });
}
