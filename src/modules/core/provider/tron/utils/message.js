import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { joinSignature, recoverAddress, SigningKey } from "ethers/lib/utils";
import { getBase58CheckAddress } from "@modules/core/provider/tron/utils/crypto";
import { hexStr2byteArray } from "@modules/core/provider/tron/utils/code";
import { ADDRESS_PREFIX } from "@modules/core/provider/tron/utils/address";

export const TRON_MESSAGE_PREFIX = "\x19TRON Signed Message:\n";

export function hashMessage(message) {
  if (typeof (message) === "string") {
    message = toUtf8Bytes(message);
  }

  return keccak256(concat([
    toUtf8Bytes(TRON_MESSAGE_PREFIX),
    toUtf8Bytes(String(message.length)),
    message,
  ]));
}

export function signMessage(message, privateKey) {
  if (!privateKey.match(/^0x/)) {
    privateKey = "0x" + privateKey;
  }

  const signingKey = new SigningKey(privateKey);
  const messageDigest = hashMessage(message);
  const signature = signingKey.signDigest(messageDigest);

  return joinSignature(signature);
}

export function verifyMessage(message, signature) {
  if (!signature.match(/^0x/)) {
    signature = "0x" + signature;
  }
  const recovered = recoverAddress(hashMessage(message), signature);
  const base58Address = getBase58CheckAddress(hexStr2byteArray(recovered.replace(/^0x/, ADDRESS_PREFIX)));

  return base58Address;
}
