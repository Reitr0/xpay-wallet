import React from 'react';
import FastImage from 'react-native-fast-image';

export default function CommonImage({source,resizeMode, ...rest}) {
    return (
        <FastImage
            resizeMode={resizeMode || 'contain'}
            source={source}
            {...rest}
            onLoad={e => {}}
            onError={({nativeEvent: {error}}) => {}}
        />
    );
}
