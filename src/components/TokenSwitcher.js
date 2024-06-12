import React from 'react';
import {StyleSheet, Switch, View} from 'react-native';

export default function TokenSwitcher({enable}) {
    return (
        <View style={[styles.container]}>
            <Switch
                trackColor={{false: '#767577', true: '#343262'}}
                ios_backgroundColor="#3e3e3e"
                value={enable}
                thumbColor={enable ? '#6552FE' : '#f4f3f4'}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        minHeight: 75,
        justifyContent: 'center',
        marginTop: 5,
    },
});
