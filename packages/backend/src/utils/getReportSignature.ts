import fs from "fs/promises";
import path from "path";
import { pathForReports } from "../constants/paths";

export async function getReportSignature(expenseId: number) {
  const signPath = path.resolve(pathForReports, `${expenseId}.bin`);
  const sign = await fs.readFile(signPath, "utf8");
  return Buffer.from(sign, "base64");
}
