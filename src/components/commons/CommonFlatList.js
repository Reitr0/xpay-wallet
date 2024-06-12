import React from 'react';
import {FlatList, View} from 'react-native';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';

export default function CommonFlatList(props) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {data, renderItem} = props;
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
                return (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <CommonText style={{color: theme.text2, marginTop: 20}}>
                            No data
                        </CommonText>
                    </View>
                );
            }}
            {...props}
        />
    );
}
