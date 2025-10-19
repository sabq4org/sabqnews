import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { verifyAccessToken, clearSession, getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    const session = await getSession();
    if (!session) {
      return null;
    }
    return session.user;
  }),

  logout: publicProcedure.mutation(async () => {
    await clearSession();
    return { success: true };
  }),
});

