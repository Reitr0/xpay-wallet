import {CurrencyService} from "@persistence/currency/CurrencyService";
import {getCurrencySuccess} from "@persistence/currency/CurrencyReducer";
export const CurrencyAction = {
    getCurrency
};

function getCurrency(to) {
    return async dispatch => {
       const currency = await CurrencyService.getCurrency(to);
       dispatch(getCurrencySuccess(currency));
    };
}


