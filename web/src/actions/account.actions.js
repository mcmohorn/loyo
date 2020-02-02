import { accountConstants } from '../constants';
import { accountService } from '../services';

export const accountActions = {
    getAccounts,
    removeAccount,
    linkAccount,
};


function getAccounts(user) {

    return dispatch => {
      if (user) {
        dispatch(request({ user }));

        accountService.getAccounts(user.token)
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

    function request(t) { return { type: accountConstants.GET_ACCOUNTS_REQUEST, t } }
    function success(accs) { return { type: accountConstants.GET_ACCOUNTS_SUCCESS, accounts: accs } }
    function failure(error) { return { type: accountConstants.GET_ACCOUNTS_FAILURE, error } }
}

function linkAccount(user, publicToken, accountId ) {
    return dispatch => {
        dispatch(request({ user }));
        accountService.linkAccount(user, publicToken, accountId)
            .then(
                accs => {
                    dispatch(success(accs));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(t) { return { type: accountConstants.LINK_ACCOUNT_REQUEST, t } }
    function success(account) { return { type: accountConstants.LINK_ACCOUNT_SUCCESS, account } }
    function failure(error) { return { type: accountConstants.LINK_ACCOUNT_FAILURE, error } }
}

function removeAccount(user, id) {

  return dispatch => {
      dispatch(request({ user }));
      accountService.removeAccount(user, id)
          .then(
              r => {
                  dispatch(success(r));
              },
              error => {
                  dispatch(failure(error));
              }
          );
  };

  function request(t) { return { type: accountConstants.REMOVE_ACCOUNT_REQUEST, t } }
  function success(r) { return { type: accountConstants.REMOVE_ACCOUNT_SUCCESS, r } }
  function failure(error) { return { type: accountConstants.REMOVE_ACCOUNT_FAILURE, error } }

}
