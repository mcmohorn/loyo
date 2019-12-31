import { newBusinessConstants } from '../constants';

export const newBusinessActions = {
    setAddresses,
    setRewards,
    setInfo
};

function setInfo(info) {
    return dispatch => {
        dispatch(setInfo( info ));
    };

    function setInfo(i) { return { type: newBusinessConstants.SET_INFO, name: i.name, description: i.description } }
}

function setAddresses(addresses) {
    return dispatch => {
        dispatch(setList( addresses ));
    };

    function setList(l) { return { type: newBusinessConstants.SET_ADDRESSES, l } }
}

function setRewards(rewards) {
    return dispatch => {
        dispatch(setList( rewards ));
    };

    function setList(l) { return { type: newBusinessConstants.SET_REWARDS, l } }
}


