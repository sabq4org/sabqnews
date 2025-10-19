import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getDb } from "../../lib/db";
import { articles, categories } from "../../drizzle/schema";
import { articlesRouter } from "./articles";
import { desc, eq } from "drizzle-orm";
import { usersRouter } from "./users";
import { authRouter } from "./auth";
import { categoriesRouter } from "./categories";
import { aiRouter } from "./ai";

export const appRouter = router({
  // Articles
  articles: articlesRouter,

  // Categories
  categories: categoriesRouter,

  // Users
  users: usersRouter,

  // Auth
  auth: authRouter,

  // AI Services
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;

