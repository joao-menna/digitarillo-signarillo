import crypto from "crypto";
import {
  pathForReports,
  privateKeyFile,
  publicKeyFile,
} from "../constants/paths";
import fs from "fs/promises";
import { getReportSignature } from "./getReportSignature";
import path from "path";

export async function verifyReportHashToSignature(
  expenseId: number,
  pdfBytes: Buffer
  // pdfBytes: DataView<ArrayBufferLike>
) {
  const publicKey = await fs.readFile(publicKeyFile, "utf8");

  const signature = await getReportSignature(expenseId);
  // const pdfPath = path.resolve(pathForReports, `${expenseId}.pdf`);
  // const pdfBytes = await fs.readFile(pdfPath);

  const hash = new Bun.CryptoHasher("sha256");
  hash.update(pdfBytes);

  return crypto.verify(
    "sha256",
    Buffer.from(hash.digest("base64")),
    { key: publicKey },
    signature
  );
}
