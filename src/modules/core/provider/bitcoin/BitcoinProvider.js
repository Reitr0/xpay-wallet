import {Provider} from '@modules/core/provider/base/Provider';
import axios, {AxiosInstance} from 'axios';
import {Logs} from '@modules/log/logs';
import * as bitcoin from 'bitcoinjs-lib';
import BitcoinUtil from '@modules/core/provider/bitcoin/BitcoinUtil';
import _ from 'lodash';
import moment from 'moment';
import {configProperties} from '@modules/core/config/config.properties';

export class BitcoinProvider implements Provider {
    apiInstance: AxiosInstance;
    testnet: boolean;

    constructor({apiEndpoint, testnet}) {
        this.apiInstance = axios.create({
            baseURL: apiEndpoint || 'https://blockstream.info/api/',
        });
        this.testnet = testnet || false;
    }

    async getNetwork(): Promise<Object> {
        return this.testnet
            ? bitcoin.networks.testnet
            : bitcoin.networks.bitcoin;
    }

    async getFeeData(): Promise<Object> {
        try {
            const {data} = await this.apiInstance.get('fee-estimates');
            return {
                success: true,
                data: {
                    fast: data['1'],
                    average: data['25'],
                    slow: data['144'],
                },
            };
        } catch (e) {
            Logs.info('BitcoinProvider: getFeeData', e);
            return {
                success: false,
                data: {
                    fast: 0,
                    average: 0,
                    slow: 0,
                },
            };
        }
    }

    async estimateGas(params): Promise<Object> {
        try {
            let {
                privateKey,
                from,
                to,
                value,
                gasPrice,
                takerFee,
                takerAddress,
            } = params;
            const network = this.testnet
                ? bitcoin.networks.testnet
                : bitcoin.networks.bitcoin;
            const psbt = new bitcoin.Psbt({
                network: network,
            });
            const utxo = await this.getUtxo(from);
            let totalAmount = 0;
            const amount = BitcoinUtil.toSatoshi(value);
            let feeAmount = 0;
            if (takerFee && takerAddress) {
                feeAmount = BitcoinUtil.toSatoshi(
                    (parseFloat(value) * parseFloat(takerFee)) / 100,
                );
                if (feeAmount < 600) {
                    feeAmount = 600;
                }
            }
            const withdrawAmount = parseFloat(amount) + parseFloat(feeAmount);
            for (let i = 0; i < utxo.length; i++) {
                totalAmount += utxo[i].value;
                if (totalAmount >= withdrawAmount) {
                    break;
                }
            }
            const change = totalAmount - withdrawAmount;

            if (change >= 0) {
                const alice = bitcoin.ECPair.fromWIF(privateKey, network);
                let splitAmount = totalAmount;
                let numberOfInputs = 0;
                for (let i = 0; i < utxo.length; i++) {
                    const nonWitnessUtxo = await this.getTx(utxo[i].txid);
                    psbt.addInput({
                        hash: utxo[i].txid,
                        index: utxo[i].vout,
                        nonWitnessUtxo: Buffer.from(nonWitnessUtxo, 'hex'),
                    });
                    splitAmount -= utxo[i].value;
                    numberOfInputs++;
                    if (splitAmount <= 0) {
                        break;
                    }
                }

                psbt.addOutput({
                    address: to,
                    value: amount,
                });
                if (takerFee && takerAddress) {
                    psbt.addOutput({
                        address: takerAddress,
                        value: feeAmount,
                    });
                }
                if (change >= 0) {
                    psbt.addOutput({
                        address: from,
                        value: change,
                    });
                }
                for (let i = 0; i < numberOfInputs; i++) {
                    psbt.signInput(i, alice);
                    psbt.validateSignaturesOfInput(i);
                }
                psbt.finalizeAllInputs();
                const virtualSize = psbt.extractTransaction().virtualSize();

                const networkFee =
                    parseFloat(gasPrice) * parseFloat(virtualSize);

                return {
                    success: true,
                    data: {
                        estimateGas: {
                            satoshi: networkFee,
                            btc: BitcoinUtil.toBTC(networkFee),
                        },
                        gas: {
                            gasPrice: parseFloat(gasPrice),
                        },
                    },
                };
            }
            throw Error('Insufficient funds.');
        } catch (e) {
            Logs.info('BitcoinProvider: estimateGas', e);
            return {
                success: false,
                data: e.reason || e.message,
            };
        }
    }

    async sendTransaction(transaction): Promise<Object> {
        try {
            let {privateKey, from, to, value, takerFee, takerAddress, gasFee} =
                transaction;
            const network = bitcoin.networks.bitcoin;
            const psbt = new bitcoin.Psbt({
                network: network,
            });
            const utxo = await this.getUtxo(from);
            let totalAmount = 0;
            const amount = BitcoinUtil.toSatoshi(value);
            let feeAmount = 0;
            if (takerFee && takerAddress) {
                feeAmount = BitcoinUtil.toSatoshi(
                    (parseFloat(value) * parseFloat(takerFee)) / 100,
                );
                if (feeAmount < 600) {
                    feeAmount = 600;
                }
            }
            const withdrawAmount = amount + feeAmount;
            const minimumRequiredAmount =
                withdrawAmount + BitcoinUtil.toSatoshi(gasFee);
            for (let i = 0; i < utxo.length; i++) {
                totalAmount += utxo[i].value;
                if (totalAmount >= minimumRequiredAmount) {
                    break;
                }
            }
            const change = totalAmount - minimumRequiredAmount;
            if (change >= 0) {
                const alice = bitcoin.ECPair.fromWIF(privateKey, network);
                let splitAmount = totalAmount;
                let numberOfInputs = 0;
                for (let i = 0; i < utxo.length; i++) {
                    const nonWitnessUtxo = await this.getTx(utxo[i].txid);
                    psbt.addInput({
                        hash: utxo[i].txid,
                        index: utxo[i].vout,
                        nonWitnessUtxo: Buffer.from(nonWitnessUtxo, 'hex'),
                    });
                    splitAmount -= utxo[i].value;
                    numberOfInputs++;
                    if (splitAmount <= 0) {
                        break;
                    }
                }
                psbt.addOutput({
                    address: to,
                    value: amount,
                });
                if (takerFee && takerAddress) {
                    psbt.addOutput({
                        address: takerAddress,
                        value: feeAmount,
                    });
                }
                if (change >= 0) {
                    psbt.addOutput({
                        address: from,
                        value: change,
                    });
                }
                for (let i = 0; i < numberOfInputs; i++) {
                    psbt.signInput(i, alice);
                    psbt.validateSignaturesOfInput(i);
                }
                psbt.finalizeAllInputs();
                const tx = psbt.extractTransaction().toHex();
                const result = await this.broadcast(tx);
                return {
                    success: true,
                    data: result,
                };
            }
            throw Error('Insufficient funds.');
        } catch (e) {
            Logs.info('BitcoinProvider: sendTransaction', e);
            return {
                success: false,
                data: e.reason || e.message,
            };
        }
    }

    async getTransactions(wallet): Promise<Object> {
        let transactions;
        let confirmUrl = `address/${wallet.walletAddress}/txs/chain`;
        const confirmed = await this.apiInstance.get(confirmUrl, {
            timeout: 12000,
        });
        let unconfirmUrl = `address/${wallet.walletAddress}/txs/mempool`;
        const unconfirmed = await this.apiInstance.get(unconfirmUrl, {
            timeout: 12000,
        });
        transactions = [...unconfirmed.data, ...confirmed.data];
        for (let i = 0; i < transactions.length; i++) {
            const vin = transactions[i].vin;
            const isSender =
                _.findIndex(vin, function (input) {
                    return (
                        input.prevout.scriptpubkey_address ===
                        wallet.walletAddress
                    );
                }) !== -1;

            transactions[i].isSender = isSender;
            transactions[i].from = wallet.walletAddress;
            const vout = transactions[i].vout;
            let sum = 0;
            _.forEach(vout, function (out) {
                if (isSender) {
                    sum +=
                        out.scriptpubkey_address !== wallet.walletAddress
                            ? out.value
                            : 0;
                } else {
                    sum +=
                        out.scriptpubkey_address === wallet.walletAddress
                            ? out.value
                            : 0;
                }
            });
            transactions[i].explore =
                configProperties.btc.explore + `tx/${transactions[i].txid}`;
            transactions[i].to = vout[0].scriptpubkey_address;
            transactions[i].value = BitcoinUtil.toBTC(sum);
            transactions[i].createdAt = moment(
                transactions[i].status?.block_time,
                'X',
            ).fromNow();
        }
        return transactions;
    }

    async getUtxo(address): Promise<Object> {
        const {data} = await this.apiInstance.get(`address/${address}/utxo`);
        return _.remove(data, function (o) {
            return o.status.confirmed === true;
        });
    }

    async getTx(txid): Promise<Object> {
        const {data} = await this.apiInstance.get(`tx/${txid}/hex`);
        return data;
    }

    async broadcast(tx) {
        const {data} = await this.apiInstance.post('tx', tx, {
            headers: {'Content-Type': 'text/plain'},
        });
        return data;
    }
}
