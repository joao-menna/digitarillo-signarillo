import { existsSync, writeFileSync } from "fs";
import { generateKeyPair } from "../signature/generateKeyPair";
import { privateKeyFile, publicKeyFile } from "../constants/paths";

export function checkKeyPairFilesExistence() {
  if (!existsSync(privateKeyFile) || !existsSync(publicKeyFile)) {
    const { publicKey, privateKey } = generateKeyPair();

    writeFileSync(
      publicKeyFile,
      publicKey.export({ format: "pem", type: "spki" }),
    );

    writeFileSync(
      privateKeyFile,
      privateKey.export({ format: "pem", type: "pkcs8" }),
    );
  }
}
