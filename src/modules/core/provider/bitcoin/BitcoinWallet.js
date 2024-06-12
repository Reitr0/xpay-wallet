import {Wallet} from '@modules/core/provider/base/Wallet';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import {bip32} from 'bitcoinjs-lib';
import {BitcoinProvider} from '@modules/core/provider/bitcoin/BitcoinProvider';
import {Logs} from '@modules/log/logs';
import {ProviderFactory} from '@modules/core/factory/ProviderFactory';
import {pbkdf2} from 'react-native-fast-crypto';
export class BitcoinWallet implements Wallet {
    provider: BitcoinProvider;

    constructor(provider: BitcoinProvider) {
        this.provider = provider;
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
            const network = await this.provider.getNetwork();
            const seed = await this.mnemonicToSeed(mnemonic);
            const root = bip32.fromSeed(Buffer.from(seed, 'hex'), network);
            const keyPair = root.derivePath("m/44'/0'/0'/0/0");
            const {address} = bitcoin.payments.p2wpkh({
                pubkey: keyPair.publicKey,
                network: network,
            });
            return {
                success: true,
                data: {
                    ...data,
                    walletAddress: address,
                    privateKey: keyPair.toWIF(),
                },
            };
        } catch (e) {
            Logs.info('BitcoinWallet: fromMnemonic', e);
            return {
                success: false,
                data: {
                    ...data,
                },
            };
        }
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
            Logs.info('BitcoinWallet: fromMnemonic', e);
            return {
                success: false,
                data: {
                    ...data,
                },
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
            Logs.info('BtcWallet: getTransactions', e);
            return {
                success: false,
                data: [],
            };
        }
    }

    async sendTransaction(transaction): Promise<Object> {
        try {
            const provider = await ProviderFactory.getProvider('BTC');
            return provider.sendTransaction(transaction);
        } catch (e) {
            Logs.info('BtcWallet: sendTransaction', e);
            return {
                success: false,
                data: e.reason,
            };
        }
    }
}
