import { existsSync, writeFileSync } from "fs";
import { cwd } from "process";
import { resolve } from "path";
import { generateCertificate } from "../signature/generateCertificate";

const caFile = resolve(cwd(), "keys", "ca.pem");
const certFile = resolve(cwd(), "keys", "digitarillo-cert.pem");
const certKeyFile = resolve(cwd(), "keys", "digitarillo-key.pem");

export async function checkCertificateFilesExistence() {
  if (
    !existsSync(caFile) ||
    !existsSync(certFile) ||
    !existsSync(certKeyFile)
  ) {
    const { ca, cert } = await generateCertificate();

    writeFileSync(caFile, ca.cert);

    writeFileSync(certFile, cert.cert);

    writeFileSync(certKeyFile, cert.key);
  }
}
