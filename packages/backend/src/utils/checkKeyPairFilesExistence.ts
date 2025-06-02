import { existsSync, writeFileSync } from "fs";
import { cwd } from "process"
import { generateKeyPair } from "../signature/generateKeyPair";
import { resolve } from "path";

const privateKeyFile = resolve(cwd(), "keys", "private-key.pem");
const publicKeyFile = resolve(cwd(), "keys", "public-key.pem");

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
