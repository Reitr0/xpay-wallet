// Import the crypto getRandomValues shim (**BEFORE** the shims)
import 'react-native-get-random-values';
// Import the the ethers shims (**BEFORE** ethers)
import '@ethersproject/shims';
import {StakingContract} from '@modules/core/staking/StakingContract';

export class StakingFactory {
    static stakingContracts = {};
    static async init({
        chain,
        stakingContractAddress,
        tokenContractAddress,
        tokenDecimals,
    }) {
        this.stakingContracts[chain] = new StakingContract(
            chain,
            stakingContractAddress,
            tokenContractAddress,
            tokenDecimals,
        );
    }
    static getStakingContract(chain) {
        return this.stakingContracts[chain];
    }
}
