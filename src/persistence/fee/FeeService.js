import React from 'react';
import CommonAPI from '@modules/api/CommonAPI';

export const FeeService = {
    getFee,
};

async function getFee(params) {
    const {data} = await CommonAPI.get('/api/v1/fee', params);
    console.log(data);
    return {success: true, data};
}
