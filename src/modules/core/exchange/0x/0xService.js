import axios from 'axios';

export const OxService = {
    getQuote,
};

let APP_URI = {
    ETH: 'https://api.0x.org/swap/v1',
    BSC: 'https://bsc.api.0x.org/swap/v1',
    POLYGON: 'https://polygon.api.0x.org/swap/v1',
};

async function getQuote(chain, params) {
    let url = `${APP_URI[chain]}/quote`;
    let response = null;
    try {
        response = await axios.get(url, {
            params: params,
            headers : {
                '0x-api-key' : '28cee9f2-ae37-4fe3-a71a-e528c8326f0d'
            }
        });
    } catch (ex) {
        console.log(ex.response.data);
        if (ex.response && ex.response.data) {
            return ex.response.data;
        }
    }
    return response?.data || null;
}
