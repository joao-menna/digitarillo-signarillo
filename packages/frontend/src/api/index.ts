import { treaty } from "@elysiajs/eden";
import type { App } from "@/backend";

export const { api } = treaty<App>(
  import.meta.env.VITE_BACKEND_URL ?? "localhost:8080",
  {
    fetch: {
      credentials: "include",
    },
  }
);
