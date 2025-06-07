import Elysia, { t } from "elysia";
import { setup } from "../middlewares/setup";
import { requireAuthentication } from "../middlewares/requireAuthentication";
import { db, table } from "../db";
import { asc, desc, eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { cwd } from "process";
import { v4 } from "uuid";
import { existsSync, mkdirSync } from "fs";

const pathForReceipts = path.resolve(cwd(), "receipts");

export const expenseRouter = new Elysia({ prefix: "/api/expense" })
  .use(setup())
  .get(
    "/",
    async ({ query, status }) => {
      const { page, limit, sort } = query;

      try {
        const [column, ordenation] = sort.split(" ");

        let columnIndex;
        switch (column) {
          case "id":
            columnIndex = table.expense.id;
            break;
          case "name":
            columnIndex = table.expense.name;
            break;
          case "amount":
            columnIndex = table.expense.amount;
            break;
          case "createdAt":
            columnIndex = table.expense.createdAt;
            break;
          default:
            columnIndex = table.expense.id;
        }

        let orderBy =
          ordenation === "desc" ? desc(columnIndex) : asc(columnIndex);

        const expenses = await db
          .select()
          .from(table.expense)
          .limit(limit)
          .offset((page - 1) * limit)
          .orderBy(orderBy);

        return expenses;
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      query: t.Object({
        page: t.Number({ minimum: 1, default: 1 }),
        limit: t.Number({ minimum: 1, default: 1 }),
        sort: t.String({ default: "id asc" }),
      }),
    },
  )
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        const [expense] = await db
          .select()
          .from(table.expense)
          .where(eq(table.expense.id, id))
          .limit(1);

        return expense;
      } catch {
        return status(404, { message: "user not found" });
      }
    },
    {
      params: t.Object({
        id: t.Number({ minimum: 1 }),
      }),
    },
  )
  .post(
    "/",
    async ({ body, status }) => {
      try {
        const [expense] = await db
          .insert(table.expense)
          .values(body)
          .returning();

        return status(201, expense);
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      body: t.Object({
        name: t.String(),
        amount: t.Number(),
        receiptPath: t.String(),
      }),
    },
  )
  .post(
    "/receipt",
    async ({ body, status }) => {
      if (!existsSync(pathForReceipts)) {
        mkdirSync(pathForReceipts);
      }

      try {
        const fileName = `${v4()}.file`;
        const filePath = path.resolve(pathForReceipts, fileName);
        const bytes = await body.file.bytes();
        await fs.writeFile(filePath, bytes);
        return {
          fileName,
        };
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      body: t.Object({
        file: t.File({ type: ["image/*", "application/pdf"] }),
      }),
    },
  )
  .use(requireAuthentication())
  .delete(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        await db.delete(table.expense).where(eq(table.expense.id, id));
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      params: t.Object({
        id: t.Number({ minimum: 1 }),
      }),
    },
  );
