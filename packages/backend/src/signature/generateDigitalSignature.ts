import crypto from "crypto";

export async function generateDigitalSignature(
  privateKey: string,
  data: string,
) {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(data);
  return sign.sign(privateKey, "base64");
}
