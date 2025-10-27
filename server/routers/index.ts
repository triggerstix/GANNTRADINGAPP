
import { router } from "../trpc";
import { gannRouter } from "./gann";
import { marketRouter } from "./market";
import { authRouter } from "./auth";

/**
 * Main application router
 * Combines all sub-routers
 */
export const appRouter = router({
  gann: gannRouter,
  market: marketRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
