import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getDb } from "../../lib/db";
import { articles, categories } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";

export const appRouter = router({
  // Articles
  articles: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        return await db
          .select()
          .from(articles)
          .where(eq(articles.status, "published"))
          .orderBy(desc(articles.publishedAt))
          .limit(input.limit)
          .offset(input.offset);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        const result = await db
          .select()
          .from(articles)
          .where(eq(articles.slug, input.slug))
          .limit(1);
        return result[0] || null;
      }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      return await db
        .select()
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(categories.displayOrder);
    }),
  }),
});

export type AppRouter = typeof appRouter;

