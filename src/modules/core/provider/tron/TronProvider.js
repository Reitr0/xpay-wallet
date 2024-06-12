import {Provider} from '@modules/core/provider/base/Provider';
import axios, {AxiosInstance} from 'axios';
import TronWeb from 'tronweb';
import {Logs} from '@modules/log/logs';
import moment from 'moment';
import {ASSET_TYPE_TOKEN} from '@modules/core/constant/constant';
import _ from 'lodash';
import {configProperties} from '@modules/core/config/config.properties';

export class TronProvider implements Provider {
    apiInstance: AxiosInstance;
    testnet: boolean;
    provider: TronWeb;

    constructor({rpcUrl, apiEndpoint, apiKey, testnet}) {
        this.apiInstance = axios.create({
            baseURL: `${apiEndpoint}` || 'https://api.trongrid.io/',
            headers: {
                'TRON-PRO-API-KEY': apiKey,
            },
        });
        this.testnet = testnet || false;
        this.provider = new TronWeb({
            fullHost: rpcUrl || 'https://api.trongrid.io/',
            headers: {'TRON-PRO-API-KEY': apiKey},
        });
    }

    async getNetwork(): Promise<Object> {}

    /*
     * Returns a best guess of the Gas Price to use in a transaction.
     */
    async getGasPrice() {}

    /*
     *
     * Returns the current recommended FeeData to use in a transaction.
     * For an EIP-1559 transaction, the maxFeePerGas and maxPriorityFeePerGas should be used.
     * For legacy transactions and networks which do not support EIP-1559, the gasPrice should be used.
     */
    async getFeeData() {}

    /*
     *
     * Returns an estimate of the amount of gas that would be required to submit transaction to the network.
     * An estimate may not be accurate since there could be another transaction on the network that was not accounted for, but after being mined affected relevant state.
     */
    async estimateGas({from}) {
        const address = TronWeb.address.toHex(from).toUpperCase();
        const defaultData = {
            freeNetLimit: 1500,
            NetLimit: 6,
            assetNetUsed: [
                {
                    key: '1001337',
                    value: 0,
                },
                {
                    key: '1000088',
                    value: 0,
                },
                {
                    key: '1000001',
                    value: 0,
                },
                {
                    key: 'TS3kGJaXyvVnWLVgM62izS24h2P9XhRE1S', // MXG contract address identifier
                    value: 0,
                },
                {
                    key: 'TAZ1dbBfBCELD49obL3Agh9GtYVrp3jkJL', // XUSDT contract address identifier
                    value: 0,
                },
            ],
            assetNetLimit: [
                {
                    key: '1001337',
                    value: 0,
                },
                {
                    key: '1000088',
                    value: 1000000000000000000,
                },
                {
                    key: '1000001',
                    value: 0,
                },
                {
                    key: 'TS3kGJaXyvVnWLVgM62izS24h2P9XhRE1S',
                    value: 1000000000000000000,
                },
                {
                    key: 'TAZ1dbBfBCELD49obL3Agh9GtYVrp3jkJL',
                    value: 1000000000000000000,
                },
            ],
            TotalNetLimit: 43200000000,
            TotalNetWeight: 84434789535,
            tronPowerLimit: 24,
            EnergyLimit: 49544,
            TotalEnergyLimit: 50000000000000,
            TotalEnergyWeight: 12110275150,
        };
        const {data} = await this.apiInstance.post(
            'wallet/getaccountresource',
            {address: address},
        );
        console.log(data);
        return {success: true, data: {...defaultData, ...data}};
    }

    /*
     * Get the estimate fee for token transferring
     */
    async getEstimateTokenGas({
        signer,
        to,
        value,
        tokenContractAddress,
        decimals,
    }) {}

    /*
     * Transfers amount tokens to target from the current signer. The return value (a boolean) is inaccessible during a write operation using a transaction.
     * Other techniques (such as events) are required if this value is required. On-chain contracts calling the transfer function have access to this result, which is why it is possible.
     */
    async transferToken({signer, tokenContractAddress, to, value}) {}

    async getTransactions(wallet): Promise<Object> {
        try {
            let transactions = [];
            let temp;
            const {data} = await axios.get(
                `${configProperties.tron.api2}transaction?sort=-timestamp&count=true&limit=20&start=0&address=${wallet.walletAddress}`,
            );
            if (wallet.type === ASSET_TYPE_TOKEN) {
                temp = _.filter(data.data, function (tx) {
                    return (
                        tx.contractType === 31 &&
                        tx.contractData.contract_address === wallet.contract
                    );
                });
            } else {
                temp = _.filter(data.data, function (tx) {
                    return tx.contractType === 1;
                });
            }
            for (let i = 0; i < temp.length; i++) {
                const item = {...temp[i]};
                item.to = item.toAddress;
                item.from = item.ownerAddress;
                item.isSender =
                    item.ownerAddress.toUpperCase() ===
                    wallet.walletAddress.toUpperCase();
                item.status = item.result === 'SUCCESS' ? '0' : '-1';
                item.createdAt = moment(item.timestamp / 1000, 'X').fromNow();
                item.value = TronWeb.fromSun(item.amount);
                item.gasFee = item.fee;
                item.explore =
                    configProperties.tron.explore +
                    `#/transaction/${item.hash}`;
                transactions.push(item);
            }
            return transactions;
        } catch (e) {
            Logs.info('TronProvider: getTransactions', e);
            return [];
        }
    }
}
