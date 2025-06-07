import { existsSync, writeFileSync } from "fs";
import { generateCertificate } from "../signature/generateCertificate";
import { caFile, certFile, certKeyFile, pfxCertFile } from "../constants/paths";

export async function checkCertificateFilesExistence() {
  if (
    !existsSync(caFile) ||
    !existsSync(certFile) ||
    !existsSync(certKeyFile) ||
    !existsSync(pfxCertFile)
  ) {
    const { ca, cert, fullChain } = await generateCertificate();

    writeFileSync(caFile, ca.cert);

    writeFileSync(certFile, cert.cert);

    writeFileSync(certKeyFile, cert.key);

    writeFileSync(pfxCertFile, fullChain)
  }
}
