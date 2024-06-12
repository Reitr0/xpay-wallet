import React, {useEffect, useState} from 'react';
import {
    Platform,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonFlatList from '@components/commons/CommonFlatList';
import {applicationProperties} from '@src/application.properties';
import CommonImage from '@components/commons/CommonImage';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useTranslation} from 'react-i18next';
import validator from 'validator';
import {WalletConnectAction} from '@persistence/walletconnect/WalletConnectAction';
import Icon, {Icons} from '@components/icons/Icons';

export default function DAppsScreen({navigation, route}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {t} = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [url, setUrl] = useState('');
    const [isUrl, setIsUrl] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            dispatch(WalletConnectAction.get());
        })();
    }, []);
    const onSearch = value => {
        setSearchValue(value);
        setIsUrl(validator.isURL(value));
    };
    const onEndEditing = () => {
        let finalUrl = searchValue;
        if (isUrl === false) {
            finalUrl = 'https://duckduckgo.com/?q=' + searchValue;
        }
        setUrl(finalUrl);
        navigation.navigate('DAppsDetailScreen', {
            item: {name: finalUrl, url: finalUrl},
        });
    };
    const renderItem = ({item, index}) => {
        return (
            <CommonTouchableOpacity
                style={[styles.item, {backgroundColor: theme.background}]}
                onPress={() => {
                    navigation.navigate('DAppsDetailScreen', {item});
                }}>
                <View style={[styles.row]}>
                    <View style={styles.leftItemContainer}>
                        <View style={[styles.iconContainer]}>
                            <CommonImage
                                source={{uri: item.logo}}
                                //source={require('@assets/images/METAIcon.png')}
                                style={styles.iconContainer}
                            />
                        </View>
                        <View style={{flex: 1, paddingHorizontal: 10}}>
                            <CommonText style={{color: theme.text2}}>
                                {t(`dapps.name${index}`)}
                            </CommonText>
                            <CommonText
                                style={{color: theme.subText}}
                                numberOfLines={3}>
                                {item.desc}
                            </CommonText>
                        </View>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };
    return (
        <View style={[styles.container, {backgroundColor: theme.background4}]}>
            <SafeAreaView style={styles.container}>
                <View
                    style={[
                        styles.header,
                        {backgroundColor: theme.background2},
                    ]}>
                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {t('dapps.dapps')}
                        </CommonText>
                        <TextInput
                            style={[
                                styles.search,
                                {
                                    color: theme.text,
                                },
                            ]}
                            autoCorrect={false}
                            placeholderTextColor={theme.subText2}
                            onChangeText={text => onSearch(text)}
                            placeholder={t('dapps.search')}
                            onEndEditing={onEndEditing}
                        />
                    </View>
                    <CommonTouchableOpacity
                        style={styles.rightHeader}
                        onPress={() => {
                            navigation.navigate('DAppsHistoryScreen');
                        }}>
                        <Icon
                            type={Icons.MaterialCommunityIcons}
                            size={18}
                            name={'history'}
                            color={theme.pinButtonColor}
                        />
                    </CommonTouchableOpacity>
                </View>
                <View
                    style={[
                        styles.content,
                        {backgroundColor: theme.background},
                    ]}>
                    <CommonFlatList
                        data={applicationProperties.dapps}
                        renderItem={renderItem}
                        keyExtractor={item => item.name}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 48,
        width: '100%',
        flexDirection: 'row',
        paddingRight: 10,
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
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
        paddingHorizontal: 10,
        flex: 1,
    },
    item: {
        width: '100%',
        marginBottom: 10,
        borderRadius: 10,
    },
    row: {
        minHeight: 70,
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
        width: 50,
        height: 50,
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
        height: 340,
        marginBottom: 170,
    },
    titleContainer: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        minHeight: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    button: {
        marginTop: 10,
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
    search: {
        fontSize: 16,
        paddingHorizontal: 10,
        height: 45,
        flex: 1,
    },
});
