import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { useSelector } from "react-redux";

const AccountIcon = (props) =>{
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
      strokeWidth={1.5}
      className="feather feather-user"
      {...props}
    >
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx={12} cy={7} r={4} />
    </Svg>
  )
}
export default AccountIcon
