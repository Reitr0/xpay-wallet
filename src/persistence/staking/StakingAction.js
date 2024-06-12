import {StakingService} from '@persistence/staking/StakingService';
import {
    getStakedBalanceSuccess,
    getStakedHistorySuccess,
    getTotalStakedBalanceSuccess,
} from '@persistence/staking/StakingReducer';

export const StakingAction = {
    getTotalStakedBalance,
    getStakedBalance,
    getStakingHistory,
    stake,
    unstake,
    claimRewards,
    checkRewards,
};

function getTotalStakedBalance(chain) {
    return async dispatch => {
        const {success, data} = await StakingService.getTotalStakedBalance(
            chain,
        );

        if (success === true) {
            dispatch(getTotalStakedBalanceSuccess(data));
        }
        return {success, data};
    };
}
function getStakedBalance(chain, walletAddress) {
    return async dispatch => {
        const {success, data} = await StakingService.getStakedBalance(
            chain,
            walletAddress,
        );

        if (success === true) {
            dispatch(getStakedBalanceSuccess(data));
        }
        return {success, data};
    };
}
function getStakingHistory(chain, walletAddress) {
    return async dispatch => {
        const {success, data} = await StakingService.getStakingHistory(
            chain,
            walletAddress,
        );
        if (success === true) {
            dispatch(getStakedHistorySuccess(data));
        }
        return {success, data};
    };
}
function stake(params) {
    return async dispatch => {
        const {success, data} = await StakingService.stake(params);
        return {success, data};
    };
}
function unstake({chain, index, gasLimit, gasPrice}) {
    return async dispatch => {
        const {success, data} = await StakingService.unstake({
            chain,
            index,
            gasLimit,
            gasPrice,
        });
        return {success, data};
    };
}

function claimRewards(chain, index) {
    return async dispatch => {
        const {success, data} = await StakingService.claimRewards(chain, index);
        return {success, data};
    };
}

function checkRewards(chain, index) {
    return async dispatch => {
        const {success, data} = await StakingService.checkRewards(chain, index);
        return {success, data};
    };
}
