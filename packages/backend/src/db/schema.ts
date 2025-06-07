import { numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const employee = pgTable("employee", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const expense = pgTable("expense", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount", { mode: "number" }).notNull(),
  receiptPath: text("receipt_path").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const report = pgTable("report", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  vote: text("vote", { enum: ["approved", "rejected", "not voted"] })
    .default("not voted")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
