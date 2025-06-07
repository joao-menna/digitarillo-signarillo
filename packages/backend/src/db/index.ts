import { drizzle } from "drizzle-orm/postgres-js";
import { employee, expense, report, user } from "./schema";

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
  },
});

export const table = {
  user,
  employee,
  expense,
  report,
} as const;
