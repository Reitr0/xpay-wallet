import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import {useTranslation} from 'react-i18next';
import {applicationProperties} from '@src/application.properties';
import WebView from 'react-native-webview';

export default function WalletBuyScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {coin} = route.params;
    const webview = useRef();
    const [canGoBack, setCanGoBack] = useState(false);
    const [url, setUrl] = useState('');
    const onNavigationStateChange = webViewState => {
        setCanGoBack(webViewState.canGoBack);
    };
    useEffect(() => {
        const link =
            applicationProperties.endpoints.ramp +
            '&userAddress=' +
            coin.walletAddress;
        setUrl(link);
    }, []);
    return (
        <SafeAreaView
            style={[styles.container, {backgroundColor: theme.background4}]}>
            <View style={[styles.header, {backgroundColor: theme.background2}]}>
                <View style={styles.leftHeader}>
                    <CommonBackButton
                        color={theme.text}
                        onPress={async () => {
                            navigation.goBack();
                        }}
                    />
                </View>
                <View style={styles.contentHeader}>
                    <CommonText style={styles.headerTitle}>
                        {t('wallet.buy')}
                    </CommonText>
                </View>
            </View>
            <View style={styles.content}>
                <WebView
                    ref={webview}
                    source={{
                        uri: url,
                    }}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={true}
                    showsVerticalScrollIndicator={false}
                    onNavigationStateChange={onNavigationStateChange}
                />
            </View>
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
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
