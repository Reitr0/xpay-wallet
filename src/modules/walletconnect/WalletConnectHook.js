import {useCallback, useEffect, useState} from 'react';
import {createWeb3Wallet} from '@modules/walletconnect/WalletConnectClient';

export default function useInitialization() {
    const [initialized, setInitialized] = useState(false);

    const onInitialize = useCallback(async () => {
        try {
            await createWeb3Wallet();
            setInitialized(true);
        } catch (err) {
            console.log('Error for initializing', err);
        }
    }, []);

    useEffect(() => {
        if (!initialized) {
            onInitialize();
        }
    }, [initialized, onInitialize]);

    return initialized;
}
