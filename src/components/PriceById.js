import * as React from 'react';
import {usePriceDetailHook} from '@persistence/price/PriceHook';
import Price from '@components/Price';

function PriceById({style, id, decimals = 5, ...rest}) {
    const {getCurrentPriceDetail} = usePriceDetailHook(id);
    return (
        <Price style={style} decimals={decimals} {...rest}>
            {getCurrentPriceDetail(0)}
        </Price>
    );
}

export default PriceById;
