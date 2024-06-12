import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import {duku_erc20, duku_bep20} from '@modules/core/constant/constant';
import usePriceHook from "@persistence/price/PriceHook";

export default function useWalletHook() {
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const [wallets, setWallets] = useState({});
    const [dukuErc20, setDukuErc20] = useState({});
    const [dukuBep20, setDukuBep20] = useState({});
    useEffect(() => {
        const walletObject = {};
        _.forEach(
            [...activeWallet.coins, ...activeWallet.tokens],
            function (item) {
                walletObject[item.id] = item;
            },
        );
        setWallets(walletObject);
        const kukuErc20 = _.find(activeWallet.tokens, {
            id: duku_erc20.id,
            chain: 'ETH',
        });
        setDukuErc20(kukuErc20);
        const kukuBep20 = _.find(activeWallet.tokens, {
            id: duku_bep20.id,
            chain: 'BSC',
        });
        setDukuBep20(kukuBep20);
    }, [activeWallet.coins, activeWallet.tokens]);
    const getByKuKuByChain = chain => {
        return chain === 'ETH' ? dukuErc20 : dukuBep20;
    };

    return {
        wallets,
        dukuErc20,
        dukuBep20,
        getByKuKuByChain,
    };
}
export function useWalletList() {
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const [wallets, setWallets] = useState([]);
    const {getPriceData} = usePriceHook();
    useEffect(() => {
        const orderWalletByTotal = _.map([...activeWallet.coins, ...activeWallet.tokens], function(item){
            return {
                ...item,
                usdValue : item.balance * getPriceData(item.id, 0)
            }
        })
        const orderedWallets = _.orderBy(
            orderWalletByTotal,
            ['usdValue'],
            ['desc'],
        );
        setWallets(orderedWallets);
    }, [activeWallet.coins, activeWallet.tokens]);

    return {
        wallets,
    };
}
