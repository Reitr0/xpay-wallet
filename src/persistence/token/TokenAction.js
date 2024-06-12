import {
    addTokenSuccess,
    getAllTokensSuccess,
} from '@persistence/token/TokenReducer';
import {TokenService} from '@persistence/token/TokenService';

export const TokenAction = {
    getAllTokens,
    addToken,
};
function getAllTokens() {
    return async dispatch => {
        const {success, data} = await TokenService.getAllTokens();
        if (success === true) {
            const {ALL, ETH, BSC, POLYGON} = data;
            dispatch(getAllTokensSuccess({ALL, ETH, BSC, POLYGON}));
        }
        return {success, data};
    };
}
function addToken(token) {
    return async dispatch => {
        const {success, data} = await TokenService.addToken(token);
        if (success === true) {
            dispatch(addTokenSuccess(data));
        }
        return {success, data};
    };
}
