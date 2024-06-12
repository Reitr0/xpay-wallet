import axios from 'axios';
import {applicationProperties} from '@src/application.properties';

const instance = axios.create({
    baseURL: applicationProperties.endpoints.app.url,
});
const post = async (url, params) => {
    return await instance
        .post(url, params)
        .then(res => {
            return {
                success: true,
                data: res.data,
            };
        })
        .catch(error => {
            console.log(url + ' ' + error);
            return {
                success: false,
                data: error,
            };
        });
};
const get = async (url, params) => {
    return await instance
        .get(url, params)
        .then(res => {
            return {
                success: true,
                data: res.data,
            };
        })
        .catch(error => {
            console.log(url + ' ' + error);
            return {
                success: false,
                data: error,
            };
        });
};
const setAuthorization = token => {
    instance.defaults.headers.common.Authorization = 'Bearer ' + token;
};
const clearAuthorization = () => {
    delete instance.defaults.headers.common.Authorization;
};
const CommonAPI = {
    post,
    get,
    setAuthorization,
    clearAuthorization,
};
export default CommonAPI;
