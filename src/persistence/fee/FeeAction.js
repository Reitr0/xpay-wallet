import {FeeService} from '@persistence/fee/FeeService';
import {getFeeSuccess} from '@persistence/fee/FeeReducer';
import FeeData from './FeeData.json';
export const FeeAction = {
    getFee,
};

function getFee(params) {
    return async dispatch => {
        dispatch(getFeeSuccess(FeeData));
    };
}
