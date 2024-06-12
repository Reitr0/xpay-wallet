import 'react-native-get-random-values';
import '@ethersproject/shims';
import {Logs} from '@modules/log/logs';
import {Wallet} from 'ethers';
import {TronProvider} from '@modules/core/provider/tron/TronProvider';
import * as Bip39 from 'bip39';
import {hdkey} from 'ethereumjs-wallet';
import {pkToAddress} from '@modules/core/provider/tron/utils/crypto';
import TronWeb from 'tronweb';
import {ProviderFactory} from '@modules/core/factory/ProviderFactory';
import {pbkdf2} from 'react-native-fast-crypto';

export const TRON_BIP39_PATH_PREFIX = "m/44'/195'";
export const TRON_BIP39_PATH_INDEX_0 = TRON_BIP39_PATH_PREFIX + "/0'/0/0";

export class TronWallet implements Wallet {
    provider: TronProvider;
    data: Object;

    constructor(provider: TronProvider) {
        this.provider = provider;
    }

    setData(data) {
        this.data = data;
    }
    async mnemonicToSeed(mnemonic, passphrase = '') {
        const mnemonicBuffer = Buffer.from(mnemonic, 'utf8');
        const saltBuffer = Buffer.from('mnemonic' + passphrase, 'utf8'); // BIP39 specifies "mnemonic" + passphrase
        const iterations = 2048; // BIP39 standard
        const keyLength = 64; // BIP39 standard length for seed
        const alg = 'sha512'; // BIP39 uses SHA512

        try {
            // Using pbkdf2.deriveAsync from your defined methods
            const seed = await pbkdf2.deriveAsync(
                mnemonicBuffer,
                saltBuffer,
                iterations,
                keyLength,
                alg,
            );

            // Convert the result to hex format if needed or use it as is
            return seed.toString('hex');
        } catch (error) {
            console.error('Error generating seed from mnemonic:', error);
            throw error;
        }
    }
    async fromMnemonic(data, mnemonic): Promise<Object> {
        try {
            const privateKey = await this.createWallet(mnemonic, 0);
            return {
                success: true,
                data: {
                    ...data,
                    walletAddress: pkToAddress(privateKey.replace(/^0x/, '')),
                    privateKey: privateKey,
                },
            };
        } catch (e) {
            Logs.info('TronWallet: fromMnemonic', e);
            return {
                success: false,
                data: {
                    ...data,
                },
            };
        }
    }

    async createWallet(mnemonic, index): Promise<Wallet> {
        const seed = await this.mnemonicToSeed(mnemonic);
        const hdNode = hdkey.fromMasterSeed(Buffer.from(seed, 'hex'));
        const node = hdNode.derivePath(TRON_BIP39_PATH_INDEX_0);
        const childWallet = node.getWallet();
        return childWallet.getPrivateKey().toString('hex');
    }

    async fromPrivateKey(data): Promise<Object> {
        try {
            return {
                success: true,
                data: {
                    ...data,
                },
            };
        } catch (e) {
            Logs.info('TronWallet: fromPrivateKey', e);
            return {
                success: false,
                data: {
                    ...data,
                },
            };
        }
    }

    async sendTransaction(transaction): Promise<Object> {
        if (transaction.tokenContractAddress) {
            return this.sendToken(transaction);
        }
        return this.sendNative(transaction);
    }

    async sendNative({
        to,
        value,
        privateKey,
        takerFee,
        takerAddress,
    }): Promise<Object> {
        try {
            await this.provider.provider.setPrivateKey(privateKey);
            const tx = await this.provider.provider.trx.sendTransaction(
                to,
                TronWeb.toSun(value),
                privateKey,
            );
            let feeTx;
            if (takerFee && takerAddress) {
                let takerAmount = (takerFee * value) / 100;
                feeTx = await this.provider.provider.trx.sendTransaction(
                    takerAddress,
                    TronWeb.toSun(takerAmount),
                    privateKey,
                );
            }
            return {
                success: true,
                data: {
                    tx,
                    feeTx,
                },
            };
        } catch (e) {
            Logs.info('TronWallet: sendNative', e);
            return {
                success: false,
                data: e.reason || e.message || e,
            };
        }
    }

    async sendToken({
        to,
        value,
        privateKey,
        takerFee,
        takerAddress,
        tokenContractAddress,
        decimals,
    }): Promise<Object> {
        try {
            await this.provider.provider.setPrivateKey(privateKey);
            const contract = await this.provider.provider
                .contract()
                .at(tokenContractAddress);
            const decimals = await contract.decimals().call();
            const decimalUnits = 10 ** decimals;
            const tx = await contract.methods
                .transfer(to, TronWeb.toSun(value))
                .send();
            let feeTx;
            if (takerFee && takerAddress) {
                let takerAmount = (takerFee * (value * decimalUnits)) / 100;
                feeTx = await contract.methods
                    .transfer(to, TronWeb.toSun(takerAmount))
                    .send();
            }
            return {
                success: true,
                data: {
                    tx,
                    feeTx,
                },
            };
        } catch (e) {
            Logs.info('TronWallet: sendToken', e);
            return {
                success: false,
                data: e.reason || e.message || e,
            };
        }
    }

    async getTransactions(wallet): Promise<Object> {
        try {
            const provider = await ProviderFactory.getProvider(wallet.chain);
            return {
                success: true,
                data: await provider.getTransactions(wallet),
            };
        } catch (e) {
            Logs.info('TronWallet: getTransactions', e);
            return {
                success: false,
                data: [],
            };
        }
    }
}
