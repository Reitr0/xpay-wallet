import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { useSelector } from "react-redux";

const CardIcon = (props) =>{
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
      className="feather feather-credit-card"
      {...props}
    >
      <Rect width={22} height={16} x={1} y={4} rx={2} ry={2} />
      <Path d="M1 10h22" />
    </Svg>
  )
}
export default CardIcon
