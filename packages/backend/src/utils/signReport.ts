import fs from "fs/promises";
import { PDFDocument, StandardFonts } from "pdf-lib";
import crypto from "crypto";
import path from "path";
import { pathForReports, privateKeyFile } from "../constants/paths";

export async function signReport(
  expenseId: number,
  userName: string,
  approved: boolean
) {
  const pdfPath = path.resolve(pathForReports, `${expenseId}.pdf`);
  const pdfBytes = await fs.readFile(pdfPath);

  const doc = await PDFDocument.load(pdfBytes);

  const font = doc.embedStandardFont(StandardFonts.TimesRomanItalic);

  const [firstPage] = doc.getPages();

  const w = firstPage.getWidth();

  firstPage.drawText(userName, {
    size: 16,
    font,
    x: ((w - 100) / 8) * 6 - 20,
    y: 78,
  });

  const form = doc.getForm();
  if (approved) {
    form.getRadioGroup("vote").select("Aprovado");
  } else {
    form.getRadioGroup("vote").select("Reprovado");
  }

  form.flatten();

  const pdfSigned = await doc.save();
  await fs.writeFile(pdfPath, pdfSigned);

  const privateKey = await fs.readFile(privateKeyFile);
  const hash = new Bun.CryptoHasher("sha256");
  hash.update(pdfSigned);

  const signature = crypto.sign("sha256", Buffer.from(hash.digest("base64")), {
    key: privateKey,
  });

  const signPath = path.resolve(pathForReports, `${expenseId}.bin`);
  await fs.writeFile(signPath, signature.toString("base64"));
}
