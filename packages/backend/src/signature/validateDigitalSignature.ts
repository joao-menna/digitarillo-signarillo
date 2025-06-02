import crypto from "crypto";

export function validateDigitalSignature(
  publicKey: string,
  data: string,
  receivedSignature: string,
) {
  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(data);
  return verify.verify(publicKey, receivedSignature, "base64");
}
