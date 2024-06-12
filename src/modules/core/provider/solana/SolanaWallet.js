import 'react-native-get-random-values';
import {Logs} from '@modules/log/logs';
import {Keypair, PublicKey, SystemProgram, Transaction} from '@solana/web3.js';
import * as Bip39 from 'bip39';
import {derivePath} from 'ed25519-hd-key';
import bs58 from 'bs58';
import {SolanaProvider} from '@modules/core/provider/solana/SolanaProvider'; // Assuming you have this
import {Wallet} from "ethers";

export const SOLANA_BIP39_PATH = "m/44'/501'/0'/0'";

export class SolanaWallet implements Wallet{
    provider: SolanaProvider;
    keypair: Keypair;

    constructor(provider: SolanaProvider) {
        this.provider = provider;
    }

    async mnemonicToSeed(mnemonic): Promise<Buffer> {
        // Solana uses a different derivation path and doesn't need a passphrase
        return Bip39.mnemonicToSeed(mnemonic);
    }

    async fromMnemonic(data, mnemonic): Promise<Object> {
        try {
            const seed = await this.mnemonicToSeed(mnemonic);
            const derivedSeed = derivePath(SOLANA_BIP39_PATH, seed.toString('hex')).key;
            this.keypair = Keypair.fromSeed(derivedSeed);
            return {
                success: true,
                data: {
                    ...data,
                    walletAddress: this.keypair.publicKey.toString(),
                    privateKey: bs58.encode(this.keypair.secretKey), // Encode to Base58
                },
            };
        } catch (e) {
            Logs.info('SolanaWallet: fromMnemonic', e);
            // ... (Error handling)
        }
    }

    async fromPrivateKey(data, privateKey): Promise<Object> {
        try {
            this.keypair = Keypair.fromSecretKey(bs58.decode(privateKey)); // Decode from Base58
            return {
                success: true,
                data: {
                    ...data,
                    walletAddress: this.keypair.publicKey.toString(),
                },
            };
        } catch (e) {
            Logs.info('SolanaWallet: fromPrivateKey', e);
            // ... (Error handling)
        }
    }

    async sendTransaction({to, value, feePayer}): Promise<Object> {
        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: this.keypair.publicKey,
                    toPubkey: new PublicKey(to),
                    lamports: value, // Value should be in lamports
                })
            );

            transaction.feePayer = feePayer || this.keypair.publicKey; // Optionally specify a fee payer
            const blockhash = await this.provider.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash.blockhash;
            transaction.sign(this.keypair);

            const txid = await this.provider.connection.sendRawTransaction(transaction.serialize());
            return {
                success: true,
                data: { txid },
            };

        } catch (e) {
            Logs.info('SolanaWallet: sendTransaction', e);
            // ... (Error handling)
        }
    }
    async getTransactions(wallet, limit = 20, before = null): Promise<Object> {
        try {
            const signatures = await this.provider.connection.getSignaturesForAddress(
                new PublicKey(wallet.walletAddress),
                { limit, before }
            );

            const transactions = await this.provider.connection.getParsedConfirmedTransactions(signatures.map(s => s.signature));

            return {
                success: true,
                data: transactions.filter(tx => tx !== null).map(tx => { // Filter out null transactions (might occur if not yet confirmed)
                    return {
                        signature: tx.transaction.signatures[0],
                        blockTime: tx.blockTime,
                        from: tx.transaction.message.accountKeys[0].pubkey, // Assuming simple transfer
                        to: tx.transaction.message.instructions[0]?.parsed.info.destination,
                        value: tx.transaction.message.instructions[0]?.parsed.info.lamports,
                        fee: tx.meta.fee,
                        status: tx.meta.err ? 'Failed' : 'Success',
                        // ... (Add other relevant fields as needed)
                    };
                }),
            };
        } catch (e) {
            Logs.info('SolanaWallet: getTransactions', e);
            return {
                success: false,
                data: [],
            };
        }
    }
}
