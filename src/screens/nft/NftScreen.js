import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import ActionSheet from 'react-native-actions-sheet';
import WebView from 'react-native-webview';
import CommonButton from '@components/commons/CommonButton';
import CommonLoading from '@components/commons/CommonLoading';
import CommonBackButton from '@components/commons/CommonBackButton';
import {
    createWeb3Wallet,
    onConnect,
    web3wallet,
} from '@modules/walletconnect/WalletConnectClient';
import {EIP155_SIGNING_METHODS} from '@modules/walletconnect/EIP155';
import {getSignParamsMessage} from '@modules/walletconnect/HelperUtils';
import {
    approveEIP155Request,
    rejectEIP155Request,
} from '@modules/walletconnect/EIP155Request';
import {WalletFactory} from '@modules/core/factory/WalletFactory';
import {getSdkError} from '@walletconnect/utils';
import _ from 'lodash';
import {CHAIN_ID_TYPE_MAP} from '@modules/core/constant/constant';
import {WalletConnectAction} from '@persistence/walletconnect/WalletConnectAction';
import CommonAlert from '@components/commons/CommonAlert';
import {useTranslation} from 'react-i18next';
import {applicationProperties} from '@src/application.properties';

export default function NftScreen({navigation, route}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const approvalSessionModal = useRef(null);
    const approvalRequestModal = useRef(null);
    const [loading, setLoading] = useState(false);
    const [pairingProposal, setPairingProposal] = useState();
    const [requestEventData, setRequestEventData] = useState();
    const [requestSession, setRequestSession] = useState();
    const [requiredNamespaces, setRequiredNamespaces] = useState({});
    const [activeChain, setActiveChain] = useState('');
    const {t} = useTranslation();
    const {walletConnectSites} = useSelector(
        state => state.WalletConnectReducer,
    );
    const webRef = useRef(null);
    const [uri, setUri] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            await createWeb3Wallet();
            web3wallet.on('session_proposal', onSessionProposal);
            web3wallet.on('session_request', onSessionRequest);
            web3wallet.on('session_delete', onSessionDelete);
        })();
    }, []);
    useEffect(() => {
        (async () => {
            web3wallet.on('session_delete', onSessionDelete);
        })();
    }, [uri]);
    const injectedJavaScriptIos = `
          //window.localStorage.clear();
          var open = false;
         (function(){
              var elements = document.querySelectorAll('*');
              elements.forEach(function(element) {
              element.addEventListener('click', function(event) {
                console.log('Click event triggered:', event);
                console.log('Click event triggered:', event.target.tagName);
                if((event.target.tagName.includes("WCM-MODAL")) && open == false){
                   open = true;
                   setTimeout(()=>{
                   try{
                     var wcmModal = document.querySelector('body wcm-modal');
                     var wcmRouter = wcmModal.shadowRoot.querySelector('wcm-modal-router');
                     var wcmQrCodeView = wcmRouter.shadowRoot.querySelector('wcm-qrcode-view');
                     var wcmModalContent = wcmQrCodeView.shadowRoot.querySelector('wcm-modal-content'); 
                     var wcmWalletConnectQr = wcmModalContent.querySelector("wcm-walletconnect-qr");
                     var qrCode = wcmWalletConnectQr.shadowRoot.querySelector("wcm-qrcode");
                     const innerHTML = qrCode.getAttribute("uri");
                     window.ReactNativeWebView.postMessage(innerHTML);
                 
                   }catch(error){
                      window.ReactNativeWebView.postMessage(error);
                   }
                   
                   },500)
                   
                }
                // Perform any desired actions here
              });
            });
            
        })();
        true; // note: this is required, or you'll sometimes get silent failures   
    `;
    const injectedJavaScriptAndroid = `
          var open = false;
         (function(){
              // window.localStorage.clear();
              var elements = document.querySelectorAll('*');
              elements.forEach(function(element) {
              element.addEventListener('click', function(event) {
                console.log('Click event triggered:', event);
                console.log('Click event triggered:', event.target.tagName);
                if((event.target.tagName.includes("WCM-MODAL")) && open == false){
                   open = true;
                   setTimeout(()=>{
                   try{
                     var htmlString = document.querySelector('body wcm-modal').getInnerHTML();
                   
                   // Regular expression pattern to match the uri attribute
                    var pattern = /uri="([^"]+)"/;
                    
                    // Use the match method to find the uri attribute value
                    var match = htmlString.match(pattern);
                    
                    // Check if a match is found and retrieve the uri value
                    if (match && match[1]) {
                      var uri = match[1];
                      console.log(uri);
                      window.ReactNativeWebView.postMessage(uri);
                    } else {
                      console.error("URI attribute not found or invalid HTML string.");
                    }
                   }catch(error){
                      window.ReactNativeWebView.postMessage(error);
                   }
                   
                   },500)
                   
                }
                // Perform any desired actions here
              });
            });
            
        })();
        true; // note: this is required, or you'll sometimes get silent failures   
    `;
    // called when there is an error in the browser
    const onBrowserError = syntheticEvent => {
        const {nativeEvent} = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
        CommonLoading.hide();
    };
    const onBrowserMessage = async event => {
        try {
            CommonLoading.show();
            //console.log("*".repeat(10));
            //console.log("Got message from the browser:", event.nativeEvent.data);
            //console.log("*".repeat(10));
            //console.log(event.nativeEvent.data);
            if (loading === false) {
                setLoading(true);
                await pair(event.nativeEvent.data);
            }
        } catch (e) {
            console.log(e);
            CommonLoading.hide();
        } finally {
            CommonLoading.hide();
        }
    };

    async function pair(wcUri) {
        const wcUrl = wcUri.replace('amp;', '');
        setUri(getUri(wcUrl));
        await onConnect({uri: wcUrl});
    }

    const onSessionProposal = useCallback(proposal => {
        setPairingProposal(proposal);
        const {params} = proposal;
        const {requiredNamespaces: mainNamespaces, optionalNamespaces} = params;
        const currentRequiredNamespaces = _.isEmpty(mainNamespaces)
            ? optionalNamespaces
            : mainNamespaces;
        setRequiredNamespaces(currentRequiredNamespaces);
        approvalSessionModal?.current.show();
    }, []);
    const onSessionRequest = useCallback(async requestEvent => {
        const {topic, params} = requestEvent;
        const {request} = params;
        const requestSessionData =
            web3wallet.engine.signClient.session.get(topic);

        switch (request.method) {
            case EIP155_SIGNING_METHODS.ETH_SIGN:
            case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
                setRequestSession(requestSessionData);
                setRequestEventData(requestEvent);
                approvalRequestModal?.current.show();
                return;

            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
                setRequestSession(requestSessionData);
                setRequestEventData(requestEvent);
                approvalRequestModal?.current.show();
                return;
            case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
                setRequestSession(requestSessionData);
                setRequestEventData(requestEvent);
                approvalRequestModal?.current.show();
                return;
        }
    }, []);
    const onSessionDelete = () => {
        setLoading(false);
        dispatch(WalletConnectAction.remove(uri));
    };
    async function handleAccept() {
        const {id, params} = pairingProposal;
        const {requiredNamespaces: mainNamespaces, optionalNamespaces} = params;
        const currentRequiredNamespaces = _.isEmpty(mainNamespaces)
            ? optionalNamespaces
            : mainNamespaces;
        let chainId = currentRequiredNamespaces.eip155?.chains[0];
        if (!_.isNil(chainId)) {
            const {relays} = params;
            chainId = chainId.replace('eip155:', '');
            const wallet = await WalletFactory.getWallet(
                CHAIN_ID_TYPE_MAP[chainId],
            );
            if (_.isNil(wallet)) {
                CommonAlert.show({
                    title: t('alert.error'),
                    message: 'Network does not support.',
                    type: 'error',
                });
                setLoading(false);
                CommonLoading.hide();
                return;
            }
            if (pairingProposal && wallet) {
                CommonLoading.show();
                const namespaces = {};
                setActiveChain(CHAIN_ID_TYPE_MAP[chainId]);
                Object.keys(currentRequiredNamespaces).forEach(key => {
                    const accounts: string[] = [];
                    currentRequiredNamespaces[key].chains.map(chain => {
                        [wallet.data.walletAddress].map(acc =>
                            accounts.push(`${chain}:${acc}`),
                        );
                    });
                    namespaces[key] = {
                        accounts,
                        methods: currentRequiredNamespaces[key].methods,
                        events: currentRequiredNamespaces[key].events,
                    };
                });
                const approveSession = {
                    id,
                    relayProtocol: relays[0].protocol,
                    namespaces,
                };
                await web3wallet.approveSession(approveSession);
                const newSite = {};
                newSite[uri] = {
                    chain: CHAIN_ID_TYPE_MAP[chainId],
                    approveSession,
                    pairingProposal,
                };
                dispatch(WalletConnectAction.add(newSite));
                CommonLoading.hide();
            }
            approvalSessionModal?.current.hide();
        }
    }

    async function handleDecline() {
        approvalSessionModal?.current.hide();

        if (!pairingProposal) {
            return;
        }
        web3wallet.rejectSession({
            id: pairingProposal.id,
            reason: getSdkError('USER_REJECTED_METHODS'),
        });
    }
    const onShouldStartLoad = event => {
        const url = event.url;
        // Check if the URL scheme is not 'https'
        if (!url.startsWith('https:')) {
            try {
                CommonLoading.show();
                if (loading === false) {
                    setLoading(true);
                    const currentSite = walletConnectSites[getUri(url)];
                    if (_.isNil(currentSite)) {
                        pair(url);
                    } else {
                        setActiveChain(currentSite.chain);
                        setUri(getUri(url));
                        setPairingProposal(currentSite.pairingProposal);
                        const {params} = pairingProposal;
                        const {
                            requiredNamespaces: mainNamespaces,
                            optionalNamespaces,
                        } = params;
                        const currentRequiredNamespaces = _.isEmpty(
                            mainNamespaces,
                        )
                            ? optionalNamespaces
                            : mainNamespaces;
                        setRequiredNamespaces(currentRequiredNamespaces);
                        setRequestSession(currentSite.requestSession);
                    }
                }
            } catch (e) {
                console.log(e);
            }
            return false;
        }
        return true;
    };
    async function onApproveRequest() {
        if (requestEventData) {
            CommonLoading.show();
            try {
                const wallet = await WalletFactory.getWallet(activeChain);
                const response = await approveEIP155Request(
                    requestEventData,
                    wallet.signer,
                );
                await web3wallet.respondSessionRequest({
                    topic: requestEventData.topic,
                    response,
                });
                approvalRequestModal?.current.hide();
            } catch (e) {
                console.log(e);
            }

            CommonLoading.hide();
        }
    }

    async function onRejectRequest() {
        if (requestEventData) {
            CommonLoading.show();
            try {
                const wallet = await WalletFactory.getWallet(activeChain);
                const response = rejectEIP155Request(
                    requestEventData,
                    wallet.signer,
                );
                await web3wallet.respondSessionRequest({
                    topic: requestEventData.topic,
                    response,
                });
                approvalRequestModal?.current.hide();
            } catch (e) {
                console.log(e);
            }

            CommonLoading.hide();
        }
    }
    const getUri = url => {
        const match = url.match(/wc:([^@]+)@2/);
        if (match && match[1]) {
            return match[1];
        }
        return '';
    };

    return (
        <SafeAreaView
            style={[styles.container, {backgroundColor: theme.background4}]}>
            <View style={styles.content}>
                <WebView
                    ref={webRef}
                    originWhitelist={['*']}
                    source={{uri: applicationProperties.endpoints.nft}}
                    onError={onBrowserError}
                    onMessage={onBrowserMessage}
                    onShouldStartLoadWithRequest={onShouldStartLoad}
                    setSupportMultipleWindows={false}
                    renderLoading={() => (
                        <ActivityIndicator size="large" color="#0000ff" />
                    )}
                    injectedJavaScript={
                        Platform.OS === 'android'
                            ? injectedJavaScriptAndroid
                            : injectedJavaScriptIos
                    }
                />
            </View>
            <ActionSheet
                ref={approvalSessionModal}
                headerAlwaysVisible
                isModal={Platform.OS === 'android'}
                useBottomSafeAreaPadding={true}
                containerStyle={[
                    styles.sessionRequestContainer,
                    {backgroundColor: theme.background4},
                ]}>
                <SafeAreaView>
                    <View style={styles.titleContainer}>
                        <CommonText
                            style={{
                                fontWeight: 'bold',
                                fontSize: 17,
                            }}>
                            {pairingProposal?.params?.proposer?.metadata?.name}
                        </CommonText>
                        <CommonText>would like to connect</CommonText>
                        <CommonText>
                            {pairingProposal?.params?.proposer?.metadata.url}
                        </CommonText>
                    </View>
                    <View style={[styles.contentContainer]}>
                        <CommonText>REQUESTED PERMISSIONS:</CommonText>
                        {requiredNamespaces?.eip155?.chains?.map(
                            (chain, index) => {
                                return (
                                    <CommonText key={chain}>
                                        {chain.toUpperCase()}
                                    </CommonText>
                                );
                            },
                        )}
                        {requiredNamespaces?.eip155?.methods?.length &&
                            requiredNamespaces?.eip155?.methods?.map(
                                (method, index) => (
                                    <CommonText key={method}>
                                        {method}
                                    </CommonText>
                                ),
                            )}

                        {requiredNamespaces?.eip155?.events?.map(
                            (method, index) => (
                                <CommonText key={method}>{method}</CommonText>
                            ),
                        )}
                    </View>
                    <View style={[styles.buttonContainer]}>
                        <View style={styles.haftButton}>
                            <CommonButton
                                text={'Approve'}
                                onPress={handleAccept}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: theme.longColor,
                                    },
                                ]}
                            />
                        </View>
                        <View style={styles.haftButton}>
                            <CommonButton
                                text={'Reject'}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: theme.text3,
                                    },
                                ]}
                                onPress={handleDecline}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </ActionSheet>
            <ActionSheet
                ref={approvalRequestModal}
                headerAlwaysVisible
                isModal={Platform.OS === 'android'}
                useBottomSafeAreaPadding={true}
                containerStyle={[
                    styles.sessionRequestContainer,
                    {backgroundColor: theme.background4},
                ]}>
                <View style={styles.titleContainer}>
                    <CommonText
                        style={{
                            fontWeight: 'bold',
                            fontSize: 17,
                        }}>
                        {pairingProposal?.params?.proposer?.metadata?.name}
                    </CommonText>
                    <CommonText>would like to connect</CommonText>
                    <CommonText>
                        {pairingProposal?.params?.proposer?.metadata.url}
                    </CommonText>
                </View>
                <View style={[styles.contentContainer]} />
                <View style={[styles.buttonContainer]}>
                    <View style={styles.haftButton}>
                        <CommonButton
                            text={'Approve'}
                            onPress={onApproveRequest}
                        />
                    </View>
                    <View style={styles.haftButton}>
                        <CommonButton
                            text={'Reject'}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: theme.text3,
                                },
                            ]}
                            onPress={onRejectRequest}
                        />
                    </View>
                </View>
            </ActionSheet>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 48,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftHeader: {
        width: 30,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    contentHeader: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
    },
    rightHeader: {
        width: 30,
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    item: {
        width: '100%',
        borderBottomWidth: 0.5,
    },
    row: {
        minHeight: 90,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftItemContainer: {
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightItemContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    browserContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 0 : 48,
    },
    sessionRequestContainer: {
        width: '100%',
        marginBottom: Platform.OS === 'android' ? 0 : 170,
    },
    titleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    contentContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        minHeight: 200,
    },
    buttonContainer: {
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 0 : 30,
    },
    haftButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    browserHeader: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
});
//wc:77911c2c73159a3100a58116ae2362f0261f3ab6c96addd1a80d676a333784d6@2?relay-protocol=irn&symKey=abb2c97d6095a0cd69322a2b6a5353b327304514fd564c473b0adbc49cfbf84a
