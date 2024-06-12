import {PriceAlertService} from '@persistence/pricealert/PriceAlertService';
import {
    getPriceAlertListSuccess,
    getPriceAlertStatusSuccess,
} from '@persistence/pricealert/PriceAlertReducer';

export const PriceAlertAction = {
    getPriceAlertList,
    addPriceAlert,
    removePriceAlert,
    getPriceAlertStatus,
    togglePriceAlertStatus,
};

function getPriceAlertStatus() {
    return async dispatch => {
        const enabled = await PriceAlertService.getPriceAlertStatus();
        dispatch(getPriceAlertStatusSuccess(enabled));
    };
}

function togglePriceAlertStatus(status) {
    return async dispatch => {
        const enabled = await PriceAlertService.togglePriceAlertStatus(status);
        dispatch(getPriceAlertStatusSuccess(enabled));
    };
}

function getPriceAlertList() {
    return async dispatch => {
        const priceAlertList = await PriceAlertService.getPriceAlertList();
        dispatch(getPriceAlertListSuccess(priceAlertList));
    };
}

function addPriceAlert(params) {
    return async dispatch => {
        const {success, data} = await PriceAlertService.addPriceAlert(params);
        if (success) {
            dispatch(getPriceAlertListSuccess(data));
        }
        return {success, data};
    };
}

function removePriceAlert(params) {
    return async dispatch => {
        const {success, data} = await PriceAlertService.removePriceAlert(
            params,
        );
        if (success) {
            dispatch(getPriceAlertListSuccess(data));
        }
        return {success, data};
    };
}
