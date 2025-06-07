import { Elysia } from "elysia";
import { authRouter } from "./controllers/auth";
import cors from "@elysiajs/cors";
import { CSRF } from "bun";
import { rateLimit } from "elysia-rate-limit";
import swagger from "@elysiajs/swagger";
import { employeeRouter } from "./controllers/employee";
import { setup } from "./middlewares/setup";
import { checkKeyPairFilesExistence } from "./utils/checkKeyPairFilesExistence";
import { config } from "dotenv";
import { expenseRouter } from "./controllers/expense";

const rateLimitDuration = 10 * 1000; // 10s
const csrfTokenDuration = 1 * 60 * 60; // 1h

config();

checkKeyPairFilesExistence()

const app = new Elysia()
  .use(swagger({ path: "/api/swagger" }))
  .use(cors())
  .use(rateLimit({ duration: rateLimitDuration }))
  .use(setup())
  .get("/api/csrf-token", ({ cookie: { csrf_token: csrfToken } }) => {
    const token = CSRF.generate();

    csrfToken.set({
      value: token,
      maxAge: csrfTokenDuration,
      httpOnly: true,
    });

    return { message: "successfully got token", csrfToken: token };
  })
  .use(authRouter)
  .use(employeeRouter)
  .use(expenseRouter)
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
