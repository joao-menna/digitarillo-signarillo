import Elysia from "elysia";
import { setup } from "./setup";

export const requireAuthentication = () =>
  new Elysia()
    .use(setup())
    .resolve(
      { as: "scoped" },
      async ({ jwt, headers, cookie: { auth }, status }) => {
        const token = auth.value ?? headers["authorization"];

        try {
          const user = await jwt.verify(token);

          if (!user) {
            return status(401, { message: "user not logged in" });
          }

          return {
            user,
          };
        } catch {
          return status(401, { message: "user not logged in" });
        }
      }
    )
    .onBeforeHandle(({ user, status }) => {
      if (!user) {
        return status(401, { message: "user not logged in" });
      }
    });
