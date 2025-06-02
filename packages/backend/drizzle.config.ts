import { defineConfig } from "drizzle-kit";

const defaultDbUrl =
  "postgresql://postgres:postgres@localhost:5432/digitarillo";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? defaultDbUrl,
  },
});
