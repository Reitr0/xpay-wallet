import {Core} from '@walletconnect/core';
import {Web3Wallet} from '@walletconnect/web3wallet';
import CommonLoading from '@components/commons/CommonLoading';

export let web3wallet;

export async function createWeb3Wallet() {
    const core = new Core({
        //logger: "debug",
        projectId: '7b6e0bd9fe7379154288cbff433bcaee',
        relayUrl: 'wss://relay.walletconnect.com',
    });
    web3wallet = await Web3Wallet.init({
        core, // <- pass the shared `core` instance
        metadata: {
            name: 'RGN Wallet',
            description: 'RGN Wallet',
            url: 'https://rgnwallet.com',
            icons: [],
        },
    });
}

export async function onConnect({uri}) {
    try {
        console.log('onConnect = ' + uri);
        return await web3wallet.core.pairing.pair({uri: uri});
    } catch (e) {
        console.log('Error');
        console.log(e);
        CommonLoading.hide();
    }
}
