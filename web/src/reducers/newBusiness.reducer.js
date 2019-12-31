import { newBusinessConstants } from '../constants';

const initialNewBusinessState = {
    name: '',
    description: '',
    addresses: [],
    rewards: [],

};

export function newBusiness(state=initialNewBusinessState, action) {
    switch (action.type){
        case newBusinessConstants.SET_REWARDS:
            state.rewards = action.l;
            return state;
        case newBusinessConstants.SET_ADDRESSES:
            state.addresses = action.l;
            return state;
        case newBusinessConstants.SET_INFO:
            state.name = action.name;
            state.description = action.description;
            return state;
        default:
            return state;
    }
}
