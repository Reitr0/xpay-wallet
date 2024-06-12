import * as React from 'react';
import CommonText from '@components/commons/CommonText';
import numeral from 'numeral';

function Balance({style, children, decimals = 5, symbol, ...rest}) {
    const format = `0,0.[${'0'.repeat(decimals)}]`;
    return (
        <CommonText style={style} {...rest}>
            {numeral(children).format(format)}
            {symbol}
        </CommonText>
    );
}

export default Balance;
