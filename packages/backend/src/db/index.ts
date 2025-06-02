import { drizzle } from "drizzle-orm/postgres-js";
import { employee, users } from "./schema";

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
  },
});

export const table = {
  users,
  employee,
} as const;
