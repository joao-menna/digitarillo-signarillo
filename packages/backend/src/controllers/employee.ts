import Elysia, { t } from "elysia";
import { setup } from "../middlewares/setup";
import { requireAuthentication } from "../middlewares/requireAuthentication";
import { db, table } from "../db";
import { asc, desc, eq } from "drizzle-orm";

export const employeeRouter = new Elysia({ prefix: "/api/employee" })
  .use(setup())
  .use(requireAuthentication())
  .get(
    "/",
    async ({ query, status }) => {
      const { page, limit, sort } = query;

      try {
        const [column, ordenation] = sort.split(" ");

        let columnIndex;
        switch (column) {
          case "id":
            columnIndex = table.employee.id;
            break;
          case "name":
            columnIndex = table.employee.name;
            break;
          case "email":
            columnIndex = table.employee.email;
            break;
          case "createdAt":
            columnIndex = table.employee.createdAt;
            break;
          default:
            columnIndex = table.employee.id;
        }

        let orderBy =
          ordenation === "desc" ? desc(columnIndex) : asc(columnIndex);

        const employee = await db
          .select()
          .from(table.employee)
          .limit(limit)
          .offset((page - 1) * limit)
          .orderBy(orderBy);

        return employee;
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
        const [employee] = await db
          .select()
          .from(table.employee)
          .where(eq(table.employee.id, id))
          .limit(1);

        return employee;
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
        const [employee] = await db
          .insert(table.employee)
          .values(body)
          .returning();

        return status(201, employee);
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
      }),
    },
  )
  .put(
    "/:id",
    async ({ body, params: { id }, status }) => {
      try {
        const [employee] = await db
          .update(table.employee)
          .set(body)
          .where(eq(table.employee.id, id))
          .returning();

        return employee;
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      params: t.Object({
        id: t.Number({ minimum: 1 }),
      }),
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        await db.delete(table.employee).where(eq(table.employee.id, id));
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
