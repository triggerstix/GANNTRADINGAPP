
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context";

/**
 * Initialize TRPC
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// You can add protected procedures here
// export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
//   if (!ctx.user) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       user: ctx.user,
//     },
//   });
// });
