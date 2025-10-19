import { z } from 'zod';


import { protectedProcedure, publicProcedure, router } from "../trpc";
import { getDb } from '@/lib/db';
import { 
  articles, 
  articleStatus, 
  users,
  articleRevisions,
  editorialComments,
  workflowHistory,
  articleTags,
  tags
} from '@/drizzle/schema';
import { count, eq, and, like, desc, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';




export const articlesRouter = router({
  // ============================================
  // العمليات الأساسية
  // ============================================
  
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(['draft', 'published', 'archived', 'review', 'approved', 'scheduled', 'killed']).optional(),
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

      const [allArticles, totalArticles] = await Promise.all([
        db
          .select()
          .from(articles)
          .where(and(...conditions))
          .orderBy(desc(articles.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: count() })
          .from(articles)
          .where(and(...conditions)),
      ]);

      return {
        articles: allArticles.map((article) => ({ ...article, content: undefined })),
        total: totalArticles[0].count,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const article = await db
        .select()
        .from(articles)
        .where(eq(articles.id, input.id))
        .limit(1);

      if (!article || article.length === 0) {
        throw new Error('المقال غير موجود');
      }

      return article[0];
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(500),
        subtitle: z.string().optional(),
        slug: z.string().min(1).max(500),
        content: z.any(),
        excerpt: z.string().optional(),
        categoryId: z.string().optional(),
        featuredImage: z.string().optional(),
        tags: z.array(z.string()).optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.array(z.string()).optional(),
        videoUrl: z.string().optional(),
        audioUrl: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceName: z.string().optional(),
        status: z.enum(['draft', 'published', 'archived', 'review', 'approved', 'scheduled', 'killed']).optional(),
        isFeatured: z.boolean().optional(),
        isBreaking: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor' && ctx.user.role !== 'writer') {
        throw new Error('غير مصرح لك بإنشاء مقالات');
      }

      const db = getDb();
      const articleId = nanoid();

      let articleSlug = input.slug;
      let slugExists = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, articleSlug));
      let counter = 1;
      while (slugExists.length > 0) {
        articleSlug = `${input.slug}-${nanoid(4)}`; // إضافة جزء عشوائي قصير
        slugExists = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, articleSlug));
        counter++;
        if (counter > 10) throw new Error('فشل في توليد slug فريد بعد عدة محاولات'); // منع حلقة لا نهائية
      }

      const newArticle = await db.insert(articles).values({
        id: articleId,
        title: input.title,
        subtitle: input.subtitle ?? null,
        slug: articleSlug,
        content: input.content,
        excerpt: input.excerpt ?? null,
        authorId: ctx.user.id,
        categoryId: input.categoryId,
        featuredImage: input.featuredImage ?? null,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        seoKeywords: input.seoKeywords ? JSON.stringify(input.seoKeywords) : null,
        videoUrl: input.videoUrl ?? null,
        audioUrl: input.audioUrl ?? null,
        sourceUrl: input.sourceUrl ?? null,
        sourceName: input.sourceName ?? null,
        status: input.status ?? 'draft',
        publishedAt: input.status === 'published' ? new Date() : null,
        isFeatured: input.isFeatured ?? false,
        isBreaking: input.isBreaking ?? false,
        currentRevision: 1,
        lastEditedBy: ctx.user.id,
      }).returning();

      // إنشاء أول مراجعة
      await db.insert(articleRevisions).values({
        id: nanoid(),
        articleId: articleId,
        revisionNumber: 1,
        title: input.title,
        subtitle: input.subtitle ?? null,
        content: input.content,
        excerpt: input.excerpt ?? null,
        editedBy: ctx.user.id,
        editReason: 'نسخة أولية',
      });

      return newArticle[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(500).optional(),
        subtitle: z.string().optional(),
        slug: z.string().min(1).max(500).optional(),
        content: z.any().optional(),
        excerpt: z.string().optional(),
        categoryId: z.string().optional(),
        featuredImage: z.string().optional(),
        tags: z.array(z.string()).optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.array(z.string()).optional(),
        videoUrl: z.string().optional(),
        audioUrl: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceName: z.string().optional(),
        isFeatured: z.boolean().optional(),
        isBreaking: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor' && ctx.user.role !== 'writer') {
        throw new Error('غير مصرح لك بتحديث المقالات');
      }

      const db = getDb();
      const { id, ...updateData } = input;

      // الحصول على المقال الحالي
      const currentArticle = await db
        .select()
        .from(articles)
        .where(eq(articles.id, id))
        .limit(1);

      if (!currentArticle || currentArticle.length === 0) {
        throw new Error('المقال غير موجود');
      }

      // التحقق من الصلاحيات
      if (ctx.user.role === 'writer' && currentArticle[0].authorId !== ctx.user.id) {
        throw new Error('غير مصرح لك بتحديث هذا المقال');
      }

      const newRevisionNumber = (currentArticle[0].currentRevision || 1) + 1;

      // تحديث المقال
      const fieldsToUpdate: Record<string, any> = { ...updateData };

      // تحديث هذه الحقول فقط إذا كان هناك تحديث فعلي للمحتوى أو العنوان
      if (input.content !== undefined || input.title !== undefined) {
        fieldsToUpdate.currentRevision = newRevisionNumber;
        fieldsToUpdate.lastEditedBy = ctx.user.id;
        fieldsToUpdate.updatedAt = new Date();
      } else if (input.isFeatured !== undefined || input.isBreaking !== undefined) {
        // إذا كان التحديث فقط لـ isFeatured أو isBreaking، قم بتحديث updatedAt فقط
        fieldsToUpdate.updatedAt = new Date();
      }

      let updatedArticle;
      try {
        updatedArticle = await db
          .update(articles)
          .set(fieldsToUpdate)
          .where(eq(articles.id, id))
          .returning();
      } catch (error) {
        console.error("Database update failed:", error);
        throw error;
      }

      // إنشاء مراجعة جديدة إذا تم تحديث المحتوى
      if (input.content || input.title) {
        await db.insert(articleRevisions).values({
          id: nanoid(),
          articleId: id,
          revisionNumber: newRevisionNumber,
          title: input.title || currentArticle[0].title,
          content: input.content || currentArticle[0].content,
          excerpt: input.excerpt || currentArticle[0].excerpt,
          editedBy: ctx.user.id,
          editReason: 'تحديث',
        });
      }

      return updatedArticle[0];
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        throw new Error('غير مصرح لك بحذف المقالات');
      }

      const db = getDb();

      // التحقق من وجود المقال
      const article = await db
        .select()
        .from(articles)
        .where(eq(articles.id, input.id))
        .limit(1);

      if (!article || article.length === 0) {
        throw new Error('المقال غير موجود');
      }

      await db.delete(articles).where(eq(articles.id, input.id));

      return { success: true, message: 'تم حذف المقال بنجاح' };
    }),

  // ============================================
  // سير العمل (Workflow)
  // ============================================

  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        toStatus: z.enum(['draft', 'published', 'archived', 'review', 'approved', 'scheduled', 'killed']),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        throw new Error('غير مصرح لك بتغيير حالة المقالات');
      }

      const db = getDb();

      // الحصول على المقال الحالي
      const article = await db
        .select()
        .from(articles)
        .where(eq(articles.id, input.id))
        .limit(1);

      if (!article || article.length === 0) {
        throw new Error('المقال غير موجود');
      }

      const fromStatus = article[0].status;

      // تحديث حالة المقال
      const updatedArticle = await db
        .update(articles)
        .set({
          status: input.toStatus,
          publishedAt: input.toStatus === 'published' ? new Date() : article[0].publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, input.id))
        .returning();

      // تسجيل في سجل سير العمل
      await db.insert(workflowHistory).values({
        id: nanoid(),
        articleId: input.id,
        fromStatus: fromStatus,
        toStatus: input.toStatus,
        userId: ctx.user.id,
        comment: input.comment,
      });

      return updatedArticle[0];
    }),

  getWorkflowHistory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();

      const history = await db
        .select()
        .from(workflowHistory)
        .where(eq(workflowHistory.articleId, input.id))
        .orderBy(desc(workflowHistory.createdAt));

      return history;
    }),

  // ============================================
  // المراجعات (Revisions)
  // ============================================

  getRevisions: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();

      const revisions = await db
        .select()
        .from(articleRevisions)
        .where(eq(articleRevisions.articleId, input.id))
        .orderBy(desc(articleRevisions.revisionNumber));

      return revisions;
    }),

  createRevision: protectedProcedure
    .input(
      z.object({
        articleId: z.string(),
        changes: z.any(),
        editReason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor' && ctx.user.role !== 'writer') {
        throw new Error('غير مصرح لك بإنشاء مراجعات');
      }

      const db = getDb();

      // الحصول على المقال الحالي
      const article = await db
        .select()
        .from(articles)
        .where(eq(articles.id, input.articleId))
        .limit(1);

      if (!article || article.length === 0) {
        throw new Error('المقال غير موجود');
      }

      const newRevisionNumber = (article[0].currentRevision || 1) + 1;

      const newRevision = await db.insert(articleRevisions).values({
        id: nanoid(),
        articleId: input.articleId,
        revisionNumber: newRevisionNumber,
        title: article[0].title,
        content: article[0].content,
        excerpt: article[0].excerpt,
        changes: input.changes,
        editedBy: ctx.user.id,
        editReason: input.editReason,
      }).returning();

      // تحديث رقم المراجعة في المقال
      await db
        .update(articles)
        .set({ currentRevision: newRevisionNumber })
        .where(eq(articles.id, input.articleId));

      return newRevision[0];
    }),

  restoreRevision: protectedProcedure
    .input(
      z.object({
        articleId: z.string(),
        revisionNumber: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        throw new Error('غير مصرح لك باستعادة المراجعات');
      }

      const db = getDb();

      // الحصول على المراجعة المطلوبة
      const revision = await db
        .select()
        .from(articleRevisions)
        .where(
          and(
            eq(articleRevisions.articleId, input.articleId),
            eq(articleRevisions.revisionNumber, input.revisionNumber)
          )
        )
        .limit(1);

      if (!revision || revision.length === 0) {
        throw new Error('المراجعة غير موجودة');
      }

      // استعادة المحتوى من المراجعة
      const updatedArticle = await db
        .update(articles)
        .set({
          title: revision[0].title,
          content: revision[0].content,
          excerpt: revision[0].excerpt,
          lastEditedBy: ctx.user.id,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, input.articleId))
        .returning();

      return updatedArticle[0];
    }),

  // ============================================
  // الملاحظات التحريرية (Editorial Comments)
  // ============================================

  addEditorialComment: protectedProcedure
    .input(
      z.object({
        articleId: z.string(),
        blockId: z.string().optional(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        throw new Error('غير مصرح لك بإضافة ملاحظات تحريرية');
      }

      const db = getDb();

      const newComment = await db.insert(editorialComments).values({
        id: nanoid(),
        articleId: input.articleId,
        userId: ctx.user.id,
        blockId: input.blockId,
        content: input.content,
      }).returning();

      return newComment[0];
    }),

  getEditorialComments: protectedProcedure
    .input(z.object({ articleId: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();

      const comments = await db
        .select()
        .from(editorialComments)
        .where(eq(editorialComments.articleId, input.articleId))
        .orderBy(desc(editorialComments.createdAt));

      return comments;
    }),

  resolveComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        throw new Error('غير مصرح لك بحل الملاحظات');
      }

      const db = getDb();

      const updatedComment = await db
        .update(editorialComments)
        .set({
          isResolved: true,
          resolvedBy: ctx.user.id,
          resolvedAt: new Date(),
        })
        .where(eq(editorialComments.id, input.commentId))
        .returning();

      return updatedComment[0];
    }),

  // ============================================
  // الجدولة والنشر
  // ============================================

  schedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        scheduledAt: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        throw new Error('غير مصرح لك بجدولة المقالات');
      }

      const db = getDb();

      const updatedArticle = await db
        .update(articles)
        .set({
          status: 'scheduled',
          scheduledAt: input.scheduledAt,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, input.id))
        .returning();

      return updatedArticle[0];
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor') {
        throw new Error('غير مصرح لك بنشر المقالات');
      }

      const db = getDb();

      const updatedArticle = await db
        .update(articles)
        .set({
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(articles.id, input.id))
        .returning();

      // تسجيل في سجل سير العمل
      await db.insert(workflowHistory).values({
        id: nanoid(),
        articleId: input.id,
        fromStatus: 'approved',
        toStatus: 'published',
        userId: ctx.user.id,
        comment: 'نشر المقال',
      });

      return updatedArticle[0];
    }),

  // ============================================
  // الوسوم والموضوعات
  // ============================================

  addTag: protectedProcedure
    .input(
      z.object({
        articleId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor' && ctx.user.role !== 'writer') {
        throw new Error('غير مصرح لك بإضافة وسوم');
      }

      const db = getDb();

      await db.insert(articleTags).values({
        articleId: input.articleId,
        tagId: input.tagId,
      });

      // تحديث عداد الاستخدام للوسم
      await db
        .update(tags)
        .set({ usageCount: sql`${tags.usageCount} + 1` })
        .where(eq(tags.id, input.tagId));

      return { success: true };
    }),

  removeTag: protectedProcedure
    .input(
      z.object({
        articleId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'editor' && ctx.user.role !== 'writer') {
        throw new Error('غير مصرح لك بإزالة وسوم');
      }

      const db = getDb();

      await db
        .delete(articleTags)
        .where(
          and(
            eq(articleTags.articleId, input.articleId),
            eq(articleTags.tagId, input.tagId)
          )
        );

      // تحديث عداد الاستخدام للوسم
      await db
        .update(tags)
        .set({ usageCount: sql`${tags.usageCount} - 1` })
        .where(eq(tags.id, input.tagId));

      return { success: true };
    }),

  // ============================================
  // الإحصائيات
  // ============================================

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
});

