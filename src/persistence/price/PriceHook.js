import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import _ from 'lodash';

const usePriceHook = () => {
    const {prices} = useSelector(state => state.PriceReducer);
    const {theme} = useSelector(state => state.ThemeReducer);
    const [currentPrices, setCurrentPrices] = useState(prices);
    useEffect(() => {
        if (_.isEmpty(prices) || _.isEmpty(currentPrices)) {
            return;
        }
        const firstObject = {...currentPrices};
        const secondObject = {...prices};
        _.forEach(firstObject, function (value, key) {
            if (_.has(secondObject, key)) {
                const bgColor =
                    secondObject[key][1] >= 0
                        ? theme.longColor
                        : theme.shortColor;
                if (value[0] > secondObject[key][0]) {
                    secondObject[key] = [
                        ...secondObject[key],
                        theme.longColor,
                        bgColor,
                    ];
                } else if (value[0] < secondObject[key][0]) {
                    secondObject[key] = [
                        ...secondObject[key],
                        theme.shortColor,
                        bgColor,
                    ];
                } else {
                    secondObject[key] = [
                        ...secondObject[key],
                        theme.text2,
                        bgColor,
                        value[5] || bgColor,
                    ];
                }
            }
        });
        setCurrentPrices(secondObject);
        return () => {
            // Clean-up logic
        };
    }, [prices]); // Only re-run the effect if 'value' changes
    const getPriceData = (id, index) => {
        if (_.isNil(currentPrices) || _.isNil(currentPrices[id])) {
            return [0, 0, 0, 0, theme.text2, theme.bg0];
        }
        return currentPrices[id][index];
    };
    return {getPriceData};
};
export const usePriceDetailHook = id => {
    const {prices} = useSelector(state => state.PriceReducer);
    const {theme} = useSelector(state => state.ThemeReducer);
    const [currentPriceDetail, setCurrentPriceDetail] = useState(prices[id]);
    useEffect(() => {
        const firstObject = [...currentPriceDetail];
        let secondObject = [...prices[id]];
        const bgColor =
            secondObject[1] >= 0 ? theme.longColor : theme.shortColor;
        if (firstObject[0] > secondObject[0]) {
            secondObject = [...secondObject, theme.longColor, bgColor];
        } else if (firstObject[0] < secondObject[0]) {
            secondObject = [...secondObject, theme.shortColor, bgColor];
        } else {
            secondObject = [
                ...secondObject,
                theme.text2,
                firstObject[5] || bgColor,
            ];
        }
        setCurrentPriceDetail(secondObject);
        return () => {
            // Clean-up logic
        };
    }, [prices]); // Only re-run the effect if 'value' changes
    const getCurrentPriceDetail = index => {
        if (_.isNil(currentPriceDetail)) {
            return [0, 0, 0, 0, theme.text2, theme.bg0];
        }
        return currentPriceDetail[index];
    };
    return {getCurrentPriceDetail};
};
export default usePriceHook;
