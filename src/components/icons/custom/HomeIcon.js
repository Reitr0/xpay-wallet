import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";

const HomeIcon = (props) =>{
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
      className="feather feather-home"
      {...props}
    >
      <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 22V12h6v10" />
    </Svg>
  )
}
export default HomeIcon
