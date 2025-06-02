import crypto from "crypto"

const keyPairOptions: crypto.RSAKeyPairKeyObjectOptions = {
  modulusLength: 4096
}

export function generateKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", keyPairOptions);
  return keyPair
}
