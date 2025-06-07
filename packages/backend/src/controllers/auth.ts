import { Elysia, t } from "elysia";
import { hash, compare } from "bcrypt";
import { db, table } from "../db";
import { createInsertSchema } from "drizzle-typebox";
import { eq } from "drizzle-orm";
import { CSRF } from "bun";
import { setup } from "../middlewares/setup";

const jwtExpiration = 1 * 60 * 60; // 1h

const registerUserSchema = createInsertSchema(table.user, {
  email: t.String({ format: "email" }),
});

export const authRouter = new Elysia({ prefix: "/api/auth" })
  .use(setup())
  .onBeforeHandle(({ headers, status }) => {
    const csrfFromHeader = headers["x-csrf-token"];

    if (!csrfFromHeader || !CSRF.verify(csrfFromHeader)) {
      return status(403, { message: "csrf_token missing or incorrect" });
    }
  })
  .post(
    "/register",
    async ({ body, status }) => {
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return status(422);
      }

      try {
        const [user] = await db
          .insert(table.user)
          .values({
            name,
            email,
            password: await hash(password, 10),
          })
          .returning();

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        };
      } catch {
        return status(409, { message: "e-mail already registered" });
      }
    },
    {
      body: t.Omit(registerUserSchema, ["id", "createdAt"]),
      detail: {
        summary: "Register a new user",
        tags: ["authentication"],
      },
    },
  )
  .post(
    "/login",
    async ({ jwt, body, status, cookie: { auth } }) => {
      const { email, password } = body;

      if (!email || !password) {
        return status(422);
      }

      try {
        const [user] = await db
          .select()
          .from(table.user)
          .where(eq(table.user.email, email))
          .limit(1);

        if (!(await compare(password, user.password))) {
          throw new Error("invalid password");
        }

        const token = await jwt.sign({
          exp: jwtExpiration,
          userId: user.id,
          userEmail: email,
        });

        auth.set({
          value: token,
          httpOnly: true,
          maxAge: jwtExpiration,
        });

        return status(200, { message: "successfully logged in", token });
      } catch {
        return status(401, { message: "invalid credentials" });
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
      detail: {
        summary: "Log In the user with the provided e-mail",
        tags: ["authentication"],
      },
    },
  );

export type Auth = typeof authRouter;
