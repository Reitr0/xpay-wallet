import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {PermissionsAndroid} from 'react-native';
export default function DAppBrowser() {
    const [tronWebScript, setTronWebScript] = useState('');

    useEffect(() => {

    }, []);
    useEffect(() => {
        requestStoragePermission();
    }, []);
    async function requestStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Access Required',
                    message:
                        'App needs access to your storage to read TronWeb.txt',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage read permission granted');
                // Permission granted, proceed with reading the file
                loadTronWebLibrary();
            } else {
                console.log('Storage read permission denied');
                // Handle the case of permission denial
            }
        } catch (err) {
            console.warn(err);
        }
    }
    async function loadTronWebLibrary() {
        try {
            setTronWebScript('tronWebLib' + overrideTronWebMethods);
        } catch (e) {
            console.log(e);
        }
    }

    // Script to inject into WebView
    const overrideTronWebMethods = `
  if (window.tronWeb && window.tronWeb.trx) {
   
// Override sign method
    tronWeb.trx.sign = function(transaction, privateKey, callback) {
      // Post a message to React Native with the transaction to sign
      window.ReactNativeWebView.postMessage(JSON.stringify({
        action: "sign",
        data: transaction
      }));
    };

`;

    async function handleMessage(event) {
        const {action, data} = JSON.parse(event.nativeEvent.data);

        // Use TronWeb in React Native
        const tronWeb = new TronWeb(
            'https://api.trongrid.io',
            'https://api.trongrid.io',
            'https://api.trongrid.io',
            'YOUR_PRIVATE_KEY',
        );

        if (action === 'sign') {
            // Just sign the transaction and send back the signed data (if needed)
            const signedTransaction = await tronWeb.trx.sign(data);
        }
    }

    return (
        <WebView
            source={{uri: 'https://sun.io/?lang=en-US#/v3/swap'}}
            injectedJavaScript={tronWebScript}
            onMessage={handleMessage}
        />
    );
}
