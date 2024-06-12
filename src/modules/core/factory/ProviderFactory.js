// Import the crypto getRandomValues shim (**BEFORE** the shims)
import 'react-native-get-random-values';
// Import the the ethers shims (**BEFORE** ethers)
import '@ethersproject/shims';
import {BitcoinProvider} from '@modules/core/provider/bitcoin/BitcoinProvider';
import {Logs} from '@modules/log/logs';
import {EthProvider} from '@modules/core/provider/eth/EthProvider';
import {TronProvider} from '@modules/core/provider/tron/TronProvider';

export class ProviderFactory {
    static providers: Object = {};

    static init(configs) {
        try {
            for (let i = 0; i < configs.length; i++) {
                const config = configs[i];
                if (config.chain === 'BTC') {
                    this.providers[config.chain] = new BitcoinProvider({
                        apiEndpoint: config.apiEndpoint,
                        testnet: config.testnet,
                    });
                } else if (
                    config.chain === 'ETH' ||
                    config.chain === 'BSC' ||
                    config.chain === 'POLYGON' ||
                    config.chain === 'ARB' ||
                    config.chain === 'BTTC'
                ) {
                    this.providers[config.chain] = new EthProvider(config);
                } else if (config.chain === 'TRON') {
                    this.providers[config.chain] = new TronProvider(config);
                }
            }
        } catch (e) {
            Logs.info('ProviderFactory: init', e);
        }
    }

    static getProvider(chain) {
        return this.providers[chain];
    }
}
