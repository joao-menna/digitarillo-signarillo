import Elysia from "elysia";
import { setup } from "./setup";

export const requireAuthentication = () =>
  new Elysia()
    .use(setup())
    .onBeforeHandle(({ headers, cookie: { auth }, status }) => {
      const token = headers["authorization"] ?? auth.value;

      if (!token) {
        return status(401, { message: "user not logged in" });
      }
    })
    .resolve(
      { as: "scoped" },
      async ({ jwt, headers, cookie: { auth }, status }) => {
        const token = headers["authorization"] ?? auth.value;

        try {
          return {
            user: await jwt.verify(token),
          };
        } catch {
          return status(401, { message: "user not logged in" });
        }
      },
    );
