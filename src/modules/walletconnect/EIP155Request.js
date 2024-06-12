import { getSignParamsMessage, getSignTypedDataParamsData } from "./HelperUtils";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { EIP155_SIGNING_METHODS } from "@modules/walletconnect/EIP155";

export async function approveEIP155Request(
  requestEvent,
  wallet,
) {
  const { params, id } = requestEvent;
  const { request } = params;

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params);
      const signedMessage = await wallet.signMessage(message);
      return formatJsonRpcResult(id, signedMessage);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      const {
        domain,
        types,
        message: data,
      } = getSignTypedDataParamsData(request.params);
      delete types.EIP712Domain;
      const signedData = await wallet._signTypedData(domain, types, data);
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const sendTransaction = request.params[0];
      const { hash } = await wallet.sendTransaction(sendTransaction);
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      const signature = await wallet.signTransaction(signTransaction);
      return formatJsonRpcResult(id, signature);

    default:
      throw new Error(getSdkError("INVALID_METHOD").message);
  }
}

export function rejectEIP155Request(
  request: SignClientTypes.EventArguments["session_request"],
) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError("USER_REJECTED_METHODS").message);
}
