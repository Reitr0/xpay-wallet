import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";

const ShoppingIcon = (props) =>{
  const {theme} = useSelector(state => state.ThemeReducer);
  const {focused,size,color} = props;
  const fillColor = focused ? theme.tabBarActiveTintColor : 'none';
  const strokeColor = focused ? 'black' : theme.tabBarInactiveTintColor;
  return(
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={fillColor}
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      className="feather feather-shopping-bag"
      {...props}
    >
      <Path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" />
      <Path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  )
}
export default ShoppingIcon
