import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";

const StakingIcon = (props) => {
  const { theme } = useSelector(state => state.ThemeReducer);
  const { focused, size, color } = props;
  const fillColor = focused ? theme.tabBarActiveTintColor : "none";
  const strokeColor = focused ? 'black' : theme.tabBarInactiveTintColor;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={fillColor}
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      className="feather feather-layers"
      {...props}
    >
      <Path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </Svg>
  )
};
export default StakingIcon;

