
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Creates context for each TRPC request
 */
export async function createContext({ req, res }: CreateExpressContextOptions) {
  // You can add user authentication here
  // For example, check for session cookies or JWT tokens
  
  return {
    req,
    res,
    // Add user info here when implementing auth
    // user: await getUserFromRequest(req),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
