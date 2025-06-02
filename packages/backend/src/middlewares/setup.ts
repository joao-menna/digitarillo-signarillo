import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { jwtSchema } from "../interfaces/jwt";
import { helmet } from "elysia-helmet";

export const setup = () => new Elysia()
  .use(helmet())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET ?? "secret",
      schema: jwtSchema,
    }),
  )
