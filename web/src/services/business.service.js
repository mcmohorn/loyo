
import { responseHandler } from '../helpers';

export const businessService = {
    getBusinesses,
    createBusiness,
    removeBusiness,
    getBusiness,
    searchBusinesses
};

// search any businesses
function searchBusinesses(query) {
    const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
    };

    return fetch(`/search?q=${query}`, requestOptions)
      .then(responseHandler.handle)
      .then(businesses => {
          return businesses;
      });
}

// get MY businesses
function getBusinesses(tok) {
    const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': tok,
          'Content-Type': 'application/json'
        },
    };

    return fetch(`/businesses`, requestOptions)
      .then(responseHandler.handle)
      .then(businesses => {
          return businesses;
      });
}
function getBusiness(id) {
    const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
    };

    return fetch(`/business/${id}`, requestOptions)
      .then(responseHandler.handle)
      .then(b => {
          return b;
      });
}

function createBusiness(user, business) {
    const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( business )
    };

    return fetch(`/business`, requestOptions)
        .then(responseHandler.handle)
        .then(business => {
            return business;
        });
}

function removeBusiness(user, id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        },
    };

    return fetch(`/business/${id}`, requestOptions)
        .then(responseHandler.handle)
        .then(ts => {
            console.log('hooray we delted' , ts);
            return ts;
        });
}
