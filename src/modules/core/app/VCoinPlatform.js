import {Logs} from '@modules/log/logs';
import {ProviderFactory} from '@modules/core/factory/ProviderFactory';
import WSSClient from '@modules/core/ws/WSClient';
import {StakingFactory} from '@modules/core/factory/StakingFactory';

export class VCoinPlatform {
    static async init() {
        try {
            await initWebSocket();
            initProvider();
        } catch (e) {
            Logs.info('App: init', e);
        }
    }
}

const initProvider = () => {
    ProviderFactory.init([
        {
            chain: 'BTC',
            apiEndpoint: 'https://blockstream.info/api/',
            testnet: false,
        },
        {
            chain: 'ETH',
            chainId: 1,
            rpcUrl: 'https://rpc.ankr.com/eth',
            apiEndpoint: 'https://api.etherscan.io/api',
            apiKey: '4DUWR9JECH25G9YCXSZ6UPERZ16SRBG6WR',
            testnet: false,
        },
        {
            chain: 'BSC',
            rpcUrl: 'https://bsc-dataseed1.defibit.io/',
            chainId: 56,
            apiEndpoint: 'https://api.bscscan.com/api',
            apiKey: '1UVR5JEUSFF5JKYCQZQKPI2YZDNHQDIWTW',
            testnet: false,
        },
        {
            chain: 'POLYGON',
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137,
            apiEndpoint: 'https://api.polygonscan.com/api',
            apiKey: 'ADZI52F2INID3WJCEJPV7TEQUQUMRNE9M7',
            testnet: false,
        },
        {
            chain: 'TRON',
            rpcUrl: 'https://api.trongrid.io/',
            apiEndpoint: 'https://api.trongrid.io/',
            apiKey: '711e28c7-a0fb-4f94-a0d7-ac41883943be',
            testnet: false,
        },
    ]);
};

const initWebSocket = async () => {
    await WSSClient.connect({
        header: { token: '' },
        callBack: null,
    });
};
