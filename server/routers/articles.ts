import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { getDb } from '@/lib/db';
import { articles, articleStatusEnum, users } from '@/drizzle/schema';
import { count, eq, and, like, desc, sql } from 'drizzle-orm';

export const articlesRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(articleStatusEnum.enumValues).optional(),
        authorId: z.string().optional(),
        categoryId: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor' && ctx.user.role !== 'writer') {
        throw new Error('غير مصرح لك بالوصول إلى هذه الميزة');
      }

      const db = getDb();
      const { search, status, authorId, categoryId, limit, offset } = input;

      const conditions = [];
      if (search) {
        conditions.push(like(articles.title, `%${search}%`));
      }
      if (status) {
        conditions.push(eq(articles.status, status));
      }
      if (authorId) {
        conditions.push(eq(articles.authorId, authorId));
      }
      if (categoryId) {
        conditions.push(eq(articles.categoryId, categoryId));
      }

      const allArticles = await db
        .select()
        .from(articles)
        .where(and(...conditions))
        .orderBy(desc(articles.createdAt))
        .limit(limit)
        .offset(offset);

      const totalArticles = await db
        .select({ count: count() })
        .from(articles)
        .where(and(...conditions));

      return {
        articles: allArticles.map((article: any) => ({ ...article, content: undefined })),
        total: totalArticles[0].count,
      };
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor' && ctx.user.role !== 'writer') {
      throw new Error('غير مصرح لك بالوصول إلى هذه الميزة');
    }

    const db = getDb();

    const totalArticles = await db.select({ count: count() }).from(articles);
    const publishedArticles = await db.select({ count: count() }).from(articles).where(eq(articles.status, 'published'));
    const draftArticles = await db.select({ count: count() }).from(articles).where(eq(articles.status, 'draft'));
    const reviewArticles = await db.select({ count: count() }).from(articles).where(eq(articles.status, 'review'));
    const scheduledArticles = await db.select({ count: count() }).from(articles).where(eq(articles.status, 'scheduled'));

    // Placeholder for total views - needs actual view tracking implementation
    const totalViews = 0;

    return {
      totalArticles: totalArticles[0].count,
      publishedArticles: publishedArticles[0].count,
      draftArticles: draftArticles[0].count,
      reviewArticles: reviewArticles[0].count,
      scheduledArticles: scheduledArticles[0].count,
      totalViews: totalViews,
    };
  }),

  // Add other article-related procedures here (create, update, delete, changeStatus, etc.)
});

