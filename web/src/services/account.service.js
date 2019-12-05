
import { authHeader, responseHandler } from '../helpers';

export const accountService = {
    getAccounts,
    linkAccount,
    removeAccount,
};

function getAccounts(tok) {
    const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': tok,
          'Content-Type': 'application/json'
        },
    };

    return fetch(`/accounts`, requestOptions)
        .then(responseHandler.handle)
        .then(accs => {
            return accs;
        });
}

function linkAccount(user, publicToken, accountId) {
    const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token:publicToken, accountId })
    };

    return fetch(`/accounts`, requestOptions)
        .then(responseHandler.handle)
        .then(ts => {
            return ts;
        });
}

function removeAccount(user, id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        },
    };

    return fetch(`/accounts/${id}`, requestOptions)
        .then(responseHandler.handle)
        .then(ts => {
            console.log('hooray we delted' , ts);
            return ts;
        });
}
