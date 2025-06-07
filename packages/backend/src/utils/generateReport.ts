import { PageSizes, PDFDocument } from "pdf-lib";
import { Employee, Expense } from "../db/schema";
import fs from "fs/promises";
import path from "path";
import { pathForReceipts, pathForReports } from "../constants/paths";
import { existsSync, mkdirSync } from "fs";
import { db, table } from "../db";
import { eq } from "drizzle-orm";

export async function generateReport(expense: Expense) {
  if (!existsSync(pathForReports)) {
    mkdirSync(pathForReports);
  }

  let employee: Employee;
  try {
    const [firstEmployee] = await db
      .select()
      .from(table.employee)
      .where(eq(table.employee.id, expense.employeeId))
      .limit(1);

    if (!firstEmployee) {
      throw new Error("employee not found");
    }

    employee = firstEmployee;
  } catch {
    employee = {
      id: expense.employeeId,
      name: "Desconhecido",
      email: "desconhecido@email.com",
      createdAt: new Date(),
    };
  }

  const doc = await PDFDocument.create();

  const page = doc.addPage(PageSizes.A4);
  const form = doc.getForm();

  const w = page.getWidth();
  const h = page.getHeight();

  page.drawText("ID:", { size: 26, x: 50, y: h - 50 });

  const idField = form.createTextField("id");
  idField.enableReadOnly();
  idField.setText(`${expense.id}`);
  idField.addToPage(page, { x: 50, y: h - 80, height: 26, width: w - 100 });

  page.drawText("Nome:", { size: 26, x: 50, y: h - 120 });

  const nameField = form.createTextField("name");
  nameField.enableReadOnly();
  nameField.setText(`${expense.name}`);
  nameField.addToPage(page, { x: 50, y: h - 150, height: 26, width: w - 100 });

  page.drawText("Custo:", { size: 26, x: 50, y: h - 190 });

  const amountField = form.createTextField("amount");
  amountField.enableReadOnly();
  amountField.setText(`R$ ${expense.amount}`);
  amountField.addToPage(page, { x: 50, y: h - 245, width: w - 100 });

  page.drawText("Criado em:", { size: 26, x: 50, y: h - 280 });

  const createdAtField = form.createTextField("created_at");
  createdAtField.enableReadOnly();
  createdAtField.setText(formatDateTime(expense.createdAt));
  createdAtField.addToPage(page, {
    x: 50,
    y: h - 310,
    height: 26,
    width: w - 100,
  });

  page.drawText("Voto:", { size: 26, x: 50, y: h / 2 + 20 });

  page.drawText("Aprovado", { size: 26, x: 110, y: h / 2 - 15 });
  page.drawText("Reprovado", { size: 26, x: 110, y: h / 2 - 45 });

  const voteField = form.createRadioGroup("vote");
  voteField.enableReadOnly();
  voteField.addOptionToPage("Aprovado", page, {
    x: 55,
    y: h / 2 - 20,
    height: 26,
  });
  voteField.addOptionToPage("Reprovado", page, {
    x: 55,
    y: h / 2 - 50,
    height: 26,
  });

  page.drawText("Recibo na próxima página", {
    size: 26,
    x: w / 4,
    y: h / 2 - 150,
  });

  page.drawText(employee.name, {
    size: 16,
    x: 50,
    y: 78,
  });

  page.drawText("____________________", {
    size: 16,
    x: 50,
    y: 70,
  });

  page.drawText("Diretor", {
    size: 16,
    x: ((w - 100) / 8) * 7 - 20,
    y: 50,
  });

  page.drawText("____________________", {
    size: 16,
    x: ((w - 100) / 8) * 6 - 20,
    y: 70,
  });

  const imagePath = path.resolve(pathForReceipts, expense.receiptPath);
  const imageBuffer = (await fs.readFile(imagePath)).buffer;
  const imageBytes = new Uint8Array(imageBuffer);

  let image;
  if (imagePath.endsWith("jpg")) {
    image = await doc.embedJpg(imageBytes);
  } else {
    image = await doc.embedPng(imageBytes);
  }

  const imagePage = doc.addPage(PageSizes.A4);

  const imageDims = image.scaleToFit(w, h);
  imagePage.drawImage(image, {
    y: h / 2 - imageDims.height / 2,
    width: imageDims.width,
    height: imageDims.height,
  });

  const bytes = await doc.save();
  const filePath = path.resolve(pathForReports, `${expense.id}.pdf`);
  await fs.writeFile(filePath, bytes);
}

function formatDateTime(date: Date) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");
  const hour = getPart("hour");
  const minute = getPart("minute");

  return `${day}/${month}/${year} ${hour}:${minute}`;
}
