import { userConstants } from '../constants';

const initialState = { value: {}, loading: false, error: null };

export function currentReward(state = initialState, action) {
    switch (action.type) {
    case userConstants.REDEEM_REWARD_REQUEST:
        return {
            value: action.reward,
            error: null,
            loading: true,
        };
    case userConstants.REDEEM_REWARD_SUCCESS:
        return {
            value: action.reward,
            error: null,
            loading: false,
        }; 
    case userConstants.REDEEM_REWARD_FAILURE:
        return {
            value: state.value,
            error: action.error,
            loading: false,
        }; 
    default:
        return state
    }
}
