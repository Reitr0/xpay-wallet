import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonImage from '@components/commons/CommonImage';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonFlatList from '@components/commons/CommonFlatList';
import Balance from '@components/Balance';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {StakingAction} from '@persistence/staking/StakingAction';
import useWalletHook from '@persistence/wallet/WalletHook';
import {applicationProperties} from '@src/application.properties';
import _ from 'lodash';
import Icon, {Icons} from '@components/icons/Icons';
import ActionSheet from 'react-native-actions-sheet';

const menus = [
    {
        id: 'flexible',
        name: 'Flexible Staking',
        code: 'Flexible',
        apr: '7%',
        desc: 'Unstake anytime',
        data: {
            duration: 5,
            rate: 7,
        },
    },
    {
        id: 'lock-30',
        name: '30-Day Lock Staking',
        code: '30 days',
        apr: '10%',
        desc: 'Stake for 30 days',
        data: {
            duration: 30 * 24 * 60 * 60,
            rate: 10,
        },
    },
    {
        id: 'lock-120',
        name: '120-Day Lock Staking',
        code: '120 days',
        apr: '12%',
        desc: 'Stake for 120 days',
        data: {
            duration: 120 * 24 * 60 * 60,
            rate: 12,
        },
    },
    {
        id: 'lock-365',
        name: '1 Year Lock Staking',
        code: '365 days',
        apr: '15%',
        desc: 'Stake for 1 Year ',
        data: {
            duration: 365 * 24 * 60 * 60,
            rate: 15,
        },
    },
    {
        id: 'lock-730',
        name: '2 Years Lock Staking',
        code: '2 Years',
        apr: '20%',
        desc: 'Stake for 2 Years',
        data: {
            duration: 365 * 2 * 24 * 60 * 60,
            rate: 20,
        },
    },
];
function StakingScreen({navigation}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const {stakedBalance} = useSelector(state => state.StakingReducer);
    const [refreshing, setRefreshing] = useState(false);
    const [chain, setChain] = useState('BSC');
    const {getByKuKuByChain} = useWalletHook();
    const duku = getByKuKuByChain(chain);
    const actionSheetRef = useRef(null);
    useEffect(() => {
        (async () => {
            console.log(chain);
            if (!_.isNil(duku?.walletAddress)) {
                dispatch(
                    StakingAction.getStakedBalance(chain, duku?.walletAddress),
                );
                dispatch(WalletAction.balance());
            }
        })();
    }, [chain]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(
            StakingAction.getStakedBalance(chain, duku?.walletAddress),
        ).then(() => {
            setRefreshing(false);
        });
        dispatch(WalletAction.balance());
    };
    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity
                onPress={() => {
                    navigation.navigate('StakingDetailScreen', {
                        item: {...item, chain},
                    });
                }}
                style={[styles.itemContainer]}>
                <View style={styles.imageContainer}>
                    <CommonImage
                        source={{uri: applicationProperties.logoURI.duku}}
                        style={{
                            width: 32,
                            height: 32,
                            borderWidth: 2,
                            borderColor: theme.bg0,
                            borderRadius: 100,
                            backgroundColor: theme.bg6,
                        }}
                    />
                </View>
                <View style={styles.itemInformationContainer}>
                    <View style={{flex: 1}}>
                        <CommonText style={{color: theme.inputText}}>
                            {item.name}
                        </CommonText>
                        <CommonText
                            style={[styles.descText, {color: theme.text7}]}>
                            {item.desc}
                        </CommonText>
                    </View>
                    <View>
                        <CommonText style={{color: theme.longColor}}>
                            {item.apr}
                        </CommonText>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };
    return (
        <View style={[styles.container, {backgroundColor: theme.background2}]}>
            <SafeAreaView
                style={[
                    styles.container,
                    {backgroundColor: theme.background2},
                ]}>
                <View style={[styles.content, {backgroundColor: theme.bg0}]}>
                    <View
                        style={[
                            styles.userInformationContainer,
                            {backgroundColor: theme.background2},
                        ]}>
                        <View style={styles.userContainerTop}>
                            <View style={[styles.userImgContainer]}>
                                <CommonImage
                                    source={{
                                        uri: applicationProperties.logoURI.duku,
                                    }}
                                    style={styles.userImg}
                                />
                            </View>
                            <View style={styles.userInfo}>
                                <CommonText style={[styles.userSubTitle]}>
                                    You have
                                </CommonText>
                                <Balance
                                    style={[styles.userTitle]}
                                    symbol={duku?.symbol}>
                                    {duku?.balance}
                                </Balance>
                            </View>
                            <View style={styles.networkContainer}>
                                <CommonTouchableOpacity
                                    onPress={() => {
                                        actionSheetRef.current?.show();
                                    }}
                                    style={styles.networkButton}>
                                    <CommonText>{chain} Network</CommonText>
                                    <Icon
                                        type={Icons.Feather}
                                        size={18}
                                        name={'chevron-down'}
                                        color={'white'}
                                    />
                                </CommonTouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.userContainerBottom}>
                            <CommonText style={styles.label}>
                                Staked{': '}
                                <Balance
                                    style={styles.userTitle}
                                    symbol={duku?.symbol}>
                                    {stakedBalance}
                                </Balance>
                            </CommonText>
                            <CommonTouchableOpacity
                                onPress={() => {
                                    navigation.navigate(
                                        'StakingHistoryScreen',
                                        {item: {chain: chain}},
                                    );
                                }}>
                                <CommonText style={styles.label}>
                                    History
                                </CommonText>
                            </CommonTouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.menuContainer}>
                        <CommonFlatList
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            data={menus}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                        />
                    </View>
                </View>
                <ActionSheet
                    ref={actionSheetRef}
                    gestureEnabled={true}
                    containerStyle={{
                        backgroundColor: theme.background2,
                    }}
                    headerAlwaysVisible>
                    <View style={styles.networkSelectionContainer}>
                        <CommonTouchableOpacity
                            onPress={() => {
                                setChain('BSC');
                            }}
                            style={styles.networkSelectionItem}>
                            <CommonText>BSC Network</CommonText>
                            {chain === 'BSC' && (
                                <Icon
                                    name="check"
                                    size={20}
                                    type={Icons.AntDesign}
                                    color={'white'}
                                />
                            )}
                        </CommonTouchableOpacity>
                        <CommonTouchableOpacity
                            onPress={() => {
                                setChain('ETH');
                            }}
                            style={styles.networkSelectionItem}>
                            <CommonText>ETH Network</CommonText>
                            {chain === 'ETH' && (
                                <Icon
                                    name="check"
                                    size={20}
                                    type={Icons.AntDesign}
                                    color={'white'}
                                />
                            )}
                        </CommonTouchableOpacity>
                    </View>
                </ActionSheet>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    userInformationContainer: {
        width: '100%',
        height: 140,
        padding: 10,
    },
    userImgContainer: {
        width: 64,
        height: 64,
    },
    userContainerTop: {
        flex: 1,
        flexDirection: 'row',
    },
    userImg: {
        flex: 1,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    userContainerBottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userSubTitle: {
        fontSize: 13,
    },
    label: {
        fontSize: 13,
    },
    promotionContainer: {
        width: '100%',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    promotion: {
        width: '100%',
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        flex: 1,
        marginVertical: 10,
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        flexDirection: 'row',
        paddingHorizontal: 5,
        height: 64,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInformationContainer: {
        flex: 1,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    descText: {
        fontSize: 11,
    },
    apr: {
        width: 50,
    },
    networkContainer: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    networkButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 5,
        backgroundColor: '#3cc3d7',
        borderRadius: 5,
        flexDirection: 'row',
    },
    networkSelectionContainer: {
        width: '100%',
        height: 120,
    },
    networkSelectionItem: {
        height: '50%',
        width: '100%',
        padding: 5,
        paddingLeft: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
});
export default StakingScreen;
