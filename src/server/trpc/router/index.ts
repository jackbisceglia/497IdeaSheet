import { ideaRouter } from "./idea";
// src/server/router/index.ts
import { t } from "../trpc";

export const appRouter = t.router({
  idea: ideaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
