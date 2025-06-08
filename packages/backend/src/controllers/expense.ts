import Elysia, { t } from "elysia";
import { setup } from "../middlewares/setup";
import { requireAuthentication } from "../middlewares/requireAuthentication";
import { db, table } from "../db";
import { asc, desc, eq, isNotNull, isNull } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";
import { existsSync, mkdirSync } from "fs";
import { generateReport } from "../utils/generateReport";
import { pathForReceipts } from "../constants/paths";
import { signReport } from "../utils/signReport";
import { verifyReportHashToSignature } from "../utils/verifyReportHashToSignature";

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
    }
  )
  .get("/pending", async ({ status }) => {
    try {
      const expenses = await db
        .select({
          id: table.expense.id,
          name: table.expense.name,
          amount: table.expense.amount,
          createdAt: table.expense.createdAt,
          employeeId: table.expense.employeeId,
          receiptPath: table.expense.receiptPath,
        })
        .from(table.expense)
        .orderBy(desc(table.expense.id))
        .leftJoin(table.report, eq(table.expense.id, table.report.expenseId))
        .where(isNull(table.report.id));

      return expenses;
    } catch {
      return status(500, { message: "internal server error" });
    }
  })
  .get("/signed", async ({ status }) => {
    try {
      const expenses = await db
        .select({
          id: table.expense.id,
          name: table.expense.name,
          amount: table.expense.amount,
          createdAt: table.expense.createdAt,
          employeeId: table.expense.employeeId,
          receiptPath: table.expense.receiptPath,
        })
        .from(table.expense)
        .orderBy(desc(table.expense.id))
        .innerJoin(table.report, eq(table.expense.id, table.report.expenseId));

      return expenses;
    } catch {
      return status(500, { message: "internal server error" });
    }
  })
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
    }
  )
  .post(
    "/",
    async ({ body, status }) => {
      try {
        const [expense] = await db
          .insert(table.expense)
          .values(body)
          .returning();

        await generateReport(expense);

        return status(201, expense);
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      body: t.Object({
        name: t.String(),
        employeeId: t.Number(),
        amount: t.Number(),
        receiptPath: t.String(),
      }),
    }
  )
  .post(
    "/receipt",
    async ({ body, status }) => {
      if (!existsSync(pathForReceipts)) {
        mkdirSync(pathForReceipts);
      }

      try {
        const ext = body.file.type === "image/jpeg" ? "jpg" : "png";
        const fileName = `${v4()}.${ext}`;
        const filePath = path.resolve(pathForReceipts, fileName);
        const bytes = await body.file.bytes();
        await fs.writeFile(filePath, bytes);
        return {
          receiptPath: fileName,
        };
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      body: t.Object({
        file: t.File({ type: ["image/jpeg", "image/png"] }),
      }),
    }
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
    }
  )
  .post(
    "/vote",
    async ({ user, body, status }) => {
      try {
        const [report] = await db
          .insert(table.report)
          .values({
            expenseId: body.id,
            vote: body.vote,
          })
          .returning();

        const [dbUser] = await db
          .select()
          .from(table.user)
          .where(eq(table.user.id, user.userId))
          .limit(1);

        await signReport(
          report.expenseId,
          dbUser.name,
          body.vote === "approved"
        );

        return status(200, { message: "expense voted" });
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      body: t.Object({
        id: t.Number({ minimum: 1 }),
        vote: t.Enum({
          approved: "approved",
          rejected: "rejected",
        }),
      }),
    }
  )
  .post(
    "/validate",
    async ({ body: { file, expenseId }, status }) => {
      try {
        const isValid = verifyReportHashToSignature(
          expenseId,
          await file.arrayBuffer()
        );
        return { isValid };
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      body: t.Object({
        expenseId: t.Number({ minimum: 1 }),
        file: t.File({ type: ["application/pdf"] }),
      }),
    }
  );
