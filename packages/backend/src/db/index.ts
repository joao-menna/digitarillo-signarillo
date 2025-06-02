import { drizzle } from "drizzle-orm/postgres-js";
import { employees, users } from "./schema";

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
  },
});

export const table = {
  users,
  employees,
} as const;
