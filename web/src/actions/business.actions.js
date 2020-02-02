import { businessConstants } from '../constants';
import { businessService } from '../services';

export const businessActions = {
    getBusinesses,
    removeBusiness,
    createBusiness,
    getBusiness,
    searchBusinesses
};

function searchBusinesses(query) {
    return dispatch => {

        dispatch(request({ query }));

        businessService.searchBusinesses(query)
        .then(
            results => {
                dispatch(success(results));
            },
            error => {
                dispatch(failure(error));
            }
        );
      

    };

    function request(q) { return { type: businessConstants.SEARCH_BUSINESSES_REQUEST, q } }
    function success(results) { return { type: businessConstants.SEARCH_BUSINESSES_SUCCESS, results } }
    function failure(error) { return { type: businessConstants.SEARCH_BUSINESSES_FAILURE, error } }
}

function getBusiness(id) {
    return dispatch => {

        dispatch(request({ id }));

        businessService.getBusiness(id)
        .then(
            b => {
                dispatch(success(b));
            },
            error => {
                dispatch(failure(error));
            }
        );
      

    };

    function request(t) { return { type: businessConstants.GET_BUSINESS_REQUEST, t } }
    function success(b) { return { type: businessConstants.GET_BUSINESS_SUCCESS, b } }
    function failure(error) { return { type: businessConstants.GET_BUSINESS_FAILURE, error } }
}

function getBusinesses(user) {
    return dispatch => {
      if (user) {
        dispatch(request({ user }));

        businessService.getBusinesses(user.token)
            .then(
                accs => {
                    dispatch(success(accs));
                },
                error => {
                    dispatch(failure(error));
                }
            );
      } else {
        dispatch(failure({}));
      }

    };

    function request(t) { return { type: businessConstants.GET_BUSINESSES_REQUEST, t } }
    function success(bs) { return { type: businessConstants.GET_BUSINESSES_SUCCESS, businesses: bs } }
    function failure(error) { return { type: businessConstants.GET_BUSINESSES_FAILURE, error } }
}

function createBusiness(user, business ) {
    return dispatch => {
        dispatch(request({ user }));
        businessService.createBusiness(user, business)
            .then(
                business => {
                    dispatch(success(business));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(t) { return { type: businessConstants.CREATE_BUSINESS_REQUEST, t } }
    function success(business) { return { type: businessConstants.CREATE_BUSINESS_SUCCESS, business } }
    function failure(error) { return { type: businessConstants.CREATE_BUSINESS_FAILURE, error } }
}

function removeBusiness(user, id) {

  return dispatch => {
      dispatch(request({ user }));
      businessService.removeBusiness(user, id)
          .then(
              r => {
                  dispatch(success(r));
              },
              error => {
                  dispatch(failure(error));
              }
          );
  };

  function request(t) { return { type: businessConstants.REMOVE_BUSINESS_REQUEST, t } }
  function success(r) { return { type: businessConstants.REMOVE_BUSINESS_SUCCESS, r } }
  function failure(error) { return { type: businessConstants.REMOVE_BUSINESS_FAILURE, error } }

}
