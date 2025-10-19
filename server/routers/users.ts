import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq, desc, like, or } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { nanoid } from 'nanoid';

export const usersRouter = router({
  // الحصول على قائمة المستخدمين
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.enum(['user', 'writer', 'editor', 'admin']).optional(),
        isActive: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      let query = db.select().from(users);

      // تطبيق الفلاتر
      const conditions = [];
      
      if (input.search) {
        conditions.push(
          or(
            like(users.name, `%${input.search}%`),
            like(users.email, `%${input.search}%`)
          )
        );
      }

      if (input.role) {
        conditions.push(eq(users.role, input.role));
      }

      if (input.isActive !== undefined) {
        conditions.push(eq(users.isActive, input.isActive));
      }

      if (conditions.length > 0) {
        query = query.where(conditions[0]);
      }

      const allUsers = await query
        .orderBy(desc(users.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      // عد إجمالي المستخدمين
      const totalUsers = await db.select().from(users);

      return {
        users: allUsers.map((u: any) => ({
          ...u,
          password: undefined, // إخفاء كلمة المرور
        })),
        total: totalUsers.length,
      };
    }),

  // الحصول على مستخدم واحد
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      return {
        ...user,
        password: undefined,
      };
    }),

  // إنشاء مستخدم جديد
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
        email: z.string().email('البريد الإلكتروني غير صالح'),
        password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
        role: z.enum(['user', 'writer', 'editor', 'admin']),
        bio: z.string().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // التحقق من صلاحيات المستخدم الحالي
      if (ctx.user.role !== 'admin') {
        throw new Error('غير مصرح - يجب أن تكون مديراً');
      }

      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // التحقق من عدم وجود بريد إلكتروني مكرر
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }

      // تشفير كلمة المرور
      const hashedPassword = await hashPassword(input.password);

      // إنشاء المستخدم
      const newUser = {
        id: `user-${nanoid(10)}`,
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
        bio: input.bio || null,
        isActive: input.isActive,
        createdAt: new Date(),
        lastSignedIn: null,
        loginMethod: 'password',
        avatarUrl: null,
      };

      await db.insert(users).values(newUser);

      return {
        success: true,
        user: {
          ...newUser,
          password: undefined,
        },
      };
    }),

  // تحديث مستخدم
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        role: z.enum(['user', 'writer', 'editor', 'admin']).optional(),
        bio: z.string().optional(),
        isActive: z.boolean().optional(),
        avatarUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // التحقق من الصلاحيات
      if (ctx.user.role !== 'admin' && ctx.user.id !== input.id) {
        throw new Error('غير مصرح - يمكنك تعديل حسابك فقط');
      }

      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // التحقق من وجود المستخدم
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!existingUser) {
        throw new Error('المستخدم غير موجود');
      }

      // تحديث البيانات
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.email) updateData.email = input.email;
      if (input.role && ctx.user.role === 'admin') updateData.role = input.role;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.isActive !== undefined && ctx.user.role === 'admin') {
        updateData.isActive = input.isActive;
      }
      if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;

      await db.update(users).set(updateData).where(eq(users.id, input.id));

      return {
        success: true,
        message: 'تم تحديث المستخدم بنجاح',
      };
    }),

  // إعادة تعيين كلمة المرور
  resetPassword: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newPassword: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // فقط المدير أو المستخدم نفسه
      if (ctx.user.role !== 'admin' && ctx.user.id !== input.id) {
        throw new Error('غير مصرح');
      }

      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      const hashedPassword = await hashPassword(input.newPassword);

      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, input.id));

      return {
        success: true,
        message: 'تم إعادة تعيين كلمة المرور بنجاح',
      };
    }),

  // حذف مستخدم
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // فقط المدير
      if (ctx.user.role !== 'admin') {
        throw new Error('غير مصرح - يجب أن تكون مديراً');
      }

      // منع حذف نفسه
      if (ctx.user.id === input.id) {
        throw new Error('لا يمكنك حذف حسابك الخاص');
      }

      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      await db.delete(users).where(eq(users.id, input.id));

      return {
        success: true,
        message: 'تم حذف المستخدم بنجاح',
      };
    }),

  // إحصائيات المستخدمين
  stats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const allUsers = await db.select().from(users);

    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.isActive).length,
      inactive: allUsers.filter(u => !u.isActive).length,
      byRole: {
        admin: allUsers.filter(u => u.role === 'admin').length,
        editor: allUsers.filter(u => u.role === 'editor').length,
        writer: allUsers.filter(u => u.role === 'writer').length,
        user: allUsers.filter(u => u.role === 'user').length,
      },
    };

    return stats;
  }),
});

