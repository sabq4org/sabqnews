import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { getDb } from '@/lib/db';
import { categories } from '@/drizzle/schema';
import { eq, desc, like, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const categoriesRouter = router({
  // الحصول على قائمة التصنيفات
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        isActive: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      let query = db.select().from(categories);

      // تطبيق الفلاتر
      const conditions = [];
      
      if (input.search) {
        conditions.push(
          or(
            like(categories.name, `%${input.search}%`),
            like(categories.slug, `%${input.search}%`)
          )
        );
      }

      if (input.isActive !== undefined) {
        conditions.push(eq(categories.isActive, input.isActive));
      }

      if (conditions.length > 0) {
        query = query.where(conditions[0]);
      }

      // الترتيب والصفحات
      const allCategories = await query
        .orderBy(desc(categories.displayOrder))
        .limit(input.limit)
        .offset(input.offset);

      // عد إجمالي التصنيفات
      const totalCategories = await db.select().from(categories);

      return {
        categories: allCategories,
        total: totalCategories.length,
      };
    }),

  // الحصول على تصنيف واحد
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (!category) {
        throw new Error('التصنيف غير موجود');
      }

      return category;
    }),

  // إنشاء تصنيف جديد
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        iconUrl: z.string().optional(),
        heroImage: z.string().optional(),
        color: z.string().optional(),
        parentId: z.string().optional(),
        displayOrder: z.number().default(0),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // التحقق من صلاحيات المستخدم الحالي
      if (ctx.user!.role !== 'admin' && ctx.user!.role !== 'editor') {
        throw new Error('غير مصرح - يجب أن تكون مديراً أو محرراً');
      }

      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // التحقق من عدم وجود slug مكرر
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);

      if (existingCategory) {
        throw new Error('الـ slug مستخدم بالفعل');
      }

      // إنشاء التصنيف
      const categoryId = nanoid();
      await db.insert(categories).values({
        id: categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        iconUrl: input.iconUrl || null,
        heroImage: input.heroImage || null,
        color: input.color || null,
        parentId: input.parentId || null,
        displayOrder: input.displayOrder,
        isActive: input.isActive,
      });

      const [newCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);

      return {
        success: true,
        category: newCategory,
      };
    }),

  // تحديث تصنيف
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        iconUrl: z.string().optional(),
        heroImage: z.string().optional(),
        color: z.string().optional(),
        parentId: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // التحقق من صلاحيات المستخدم الحالي
      if (ctx.user!.role !== 'admin' && ctx.user!.role !== 'editor') {
        throw new Error('غير مصرح - يجب أن تكون مديراً أو محرراً');
      }

      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // التحقق من وجود التصنيف
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (!existingCategory) {
        throw new Error('التصنيف غير موجود');
      }

      // التحقق من عدم وجود slug مكرر (إذا تم تحديثه)
      if (input.slug && input.slug !== existingCategory.slug) {
        const [duplicateSlug] = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, input.slug))
          .limit(1);

        if (duplicateSlug) {
          throw new Error('الـ slug مستخدم بالفعل');
        }
      }

      // تحديث البيانات
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.slug) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.iconUrl !== undefined) updateData.iconUrl = input.iconUrl;
      if (input.heroImage !== undefined) updateData.heroImage = input.heroImage;
      if (input.color !== undefined) updateData.color = input.color;
      if (input.parentId !== undefined) updateData.parentId = input.parentId;
      if (input.displayOrder !== undefined) updateData.displayOrder = input.displayOrder;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;
      updateData.updatedAt = new Date();

      await db.update(categories).set(updateData).where(eq(categories.id, input.id));

      return {
        success: true,
        message: 'تم تحديث التصنيف بنجاح',
      };
    }),

  // حذف تصنيف
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // التحقق من صلاحيات المستخدم الحالي
      if (ctx.user!.role !== 'admin') {
        throw new Error('غير مصرح - يجب أن تكون مديراً');
      }

      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // التحقق من وجود التصنيف
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (!existingCategory) {
        throw new Error('التصنيف غير موجود');
      }

      // حذف التصنيف
      await db.delete(categories).where(eq(categories.id, input.id));

      return {
        success: true,
        message: 'تم حذف التصنيف بنجاح',
      };
    }),

  // إحصائيات التصنيفات
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const allCategories = await db.select().from(categories);

    const stats = {
      total: allCategories.length,
      active: allCategories.filter((c: any) => c.isActive).length,
      inactive: allCategories.filter((c: any) => !c.isActive).length,
    };

    return stats;
  }),
});

