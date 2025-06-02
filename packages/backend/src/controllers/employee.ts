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
            columnIndex = table.employees.id;
            break;
          case "name":
            columnIndex = table.employees.name;
            break;
          case "email":
            columnIndex = table.employees.email;
            break;
          case "createdAt":
            columnIndex = table.employees.createdAt;
            break;
          default:
            columnIndex = table.employees.id;
        }

        let orderBy =
          ordenation === "desc" ? desc(columnIndex) : asc(columnIndex);

        const employees = await db
          .select()
          .from(table.employees)
          .limit(limit)
          .offset((page - 1) * limit)
          .orderBy(orderBy);

        return employees;
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
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        const [employee] = await db
          .select()
          .from(table.employees)
          .where(eq(table.employees.id, id))
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
    }
  )
  .post(
    "/",
    async ({ body, status }) => {
      try {
        const [employee] = await db
          .insert(table.employees)
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
    }
  )
  .put(
    "/:id",
    async ({ body, params: { id }, status }) => {
      try {
        const [employee] = await db
          .update(table.employees)
          .set(body)
          .where(eq(table.employees.id, id))
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
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        await db.delete(table.employees).where(eq(table.employees.id, id));
        return { message: "deleted successfully" };
      } catch {
        return status(500, { message: "internal server error" });
      }
    },
    {
      params: t.Object({
        id: t.Number({ minimum: 1 }),
      }),
    }
  );
