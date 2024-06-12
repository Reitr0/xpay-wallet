import {ContractFactory, ethers} from 'ethers';
import {StakingFactory} from '@modules/core/factory/StakingFactory';
import _ from 'lodash';
import * as React from 'react';
import {Logs} from '@modules/log/logs';

export const StakingService = {
    getTotalStakedBalance,
    getStakedBalance,
    getStakingHistory,
    stake,
    unstake,
    claimRewards,
    checkRewards,
};

async function getTotalStakedBalance(chain) {
    const contract = await StakingFactory.getStakingContract(chain);
    const totalStakedBalance = contract.stakingContract.getTotalStakedBalance();
    return {
        success: true,
        data: ethers.utils.formatUnits(
            totalStakedBalance,
            contract.tokenDecimals,
        ),
    };
}

async function getStakedBalance(chain, walletAddress) {
    try {
        const contract = await StakingFactory.getStakingContract(chain);
        const staked = await contract.stakingContract.getStakedBalance(
            walletAddress,
        );
        console.log(staked);
        return {
            success: true,
            data: ethers.utils.formatUnits(staked, contract.tokenDecimals),
        };
    } catch (e) {
        console.log(e);
    }
}

async function getStakingHistory(chain, walletAddress) {
    try {
        const contract = await StakingFactory.getStakingContract(chain);
        const stakingHistoryResult =
            await contract.stakingContract.getStakingHistory(walletAddress);
        const stakingHistory = [];
        if (stakingHistoryResult.length > 0) {
            stakingHistoryResult.forEach((item, index) => {
                stakingHistory.push({
                    index: index,
                    timestamp: ethers.BigNumber.from(item[0]).toNumber(),
                    amount: ethers.utils.formatUnits(item[1], 18), // Assuming 18 decimal places for your token
                    rate: ethers.utils.formatEther(item[2]),
                    lockDuration: ethers.BigNumber.from(item[3]).toNumber(),
                    lockTime: ethers.BigNumber.from(item[4]).toNumber(),
                    claimedRewards: ethers.utils.formatUnits(item[5], 18), // Assuming 18 decimal places for your token
                    status: item[6],
                });
            });
        }
        return {
            success: true,
            data: _.orderBy(stakingHistory, ['timestamp'], ['desc']),
        };
    } catch (e) {
        Logs.error(e);
    }
}

async function stake({chain, amount, duration, gasPrice, gasLimit}) {
    try {
        const contract = await StakingFactory.getStakingContract(chain);
        await contract.tokenContract.approve(
            contract.stakingContractAddress,
            amount,
            {
                gasPrice: gasPrice,
                gasLimit: gasLimit,
            },
        );
        const tx = await contract.stakingContract.stake(amount, duration, {
            gasPrice,
            gasLimit,
        });
        await tx.wait(1);
        return {
            success: true,
            data: {},
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            data: e,
        };
    }
}

async function unstake({chain, index, gasPrice, gasLimit}) {
    try {
        console.log({chain, index, gasPrice, gasLimit})
        const contract = await StakingFactory.getStakingContract(chain);
        const unstakedTx = await contract.stakingContract.unstake(index, {
            gasPrice,
            gasLimit,
        });
        await unstakedTx.wait(3);
        return {
            success: true,
            data: {},
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            data: e,
        };
    }
}
async function claimRewards({chain, index, gasPrice, gasLimit}) {
    try {
        const contract = await StakingFactory.getStakingContract(chain);
        const claimsTx = await contract.stakingContract.claimRewards(index, {
            gasPrice,
            gasLimit,
        });
        await claimsTx.wait(3);
        return {
            success: true,
            data: {},
        };
    } catch (e) {
        return {
            success: false,
            data: e,
        };
    }
}
async function checkRewards(chain, index) {
    try {
        const contract = await StakingFactory.getStakingContract(chain);
        const checkRewardsTx = await contract.stakingContract.checkRewards(
            index,
        );
        return {
            success: true,
            data: {},
        };
    } catch (e) {
        return {
            success: false,
            data: e,
        };
    }
}
