import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getSession } from "@/lib/auth";

// Define context type
interface Context {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  } | null;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure with authentication middleware
export const protectedProcedure = t.procedure.use(async ({ next }) => {
  const session = await getSession();

  if (!session || !session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "غير مصرح - يجب تسجيل الدخول" });
  }

  return next({
    ctx: {
      user: session.user,
    },
  });
});

