import { t } from "elysia";

export const jwtSchema = t.Object({
  userEmail: t.String(),
  userId: t.Number(),
});
