import EncryptedStorage from 'react-native-encrypted-storage';
import {Logs} from '@modules/log/logs';
import _ from "lodash";

async function setItem(key, value) {
    try {
        await EncryptedStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        Logs.info('StorageService: setItem' + error);
    }
}

async function getItem(key) {
    try {
        const value = await EncryptedStorage.getItem(key);
        if (!_.isNil(value)) {
            return JSON.parse(value);
        }
    } catch (error) {
        Logs.info('StorageService: getItem' + error);
    }
}

async function deleteItem(key) {
    try {
        await EncryptedStorage.removeItem(key);
    } catch (error) {
        Logs.info('StorageService: deleteItem' + error);
    }
}

async function clear() {
    try {
        await EncryptedStorage.clear();
    } catch (error) {
        Logs.info('StorageService: deleteItem' + error);
    }
}

export const StorageService = {
    setItem,
    getItem,
    deleteItem,
    clear,
};
