import * as React from "react";
import CommonText from "@components/commons/CommonText";
import numeral from "numeral";

function NumberFormatted({
                           style,
                           children,
                           decimals = 5,
                           symbol,
                           sign,
                           ...rest
                         }) {
  let format = `0,0.[${"0".repeat(decimals)}]`;
  if (sign === true) {
    if (children < 0) {
      format = `-0,0.[${"0".repeat(decimals)}]`;
    } else {
      format = `+0,0.[${"0".repeat(decimals)}]`;
    }
  }
  return (
    <CommonText style={style} {...rest}>
      {numeral(children).format(format)}
      {symbol || ""}
    </CommonText>
  );
}

export default NumberFormatted;
