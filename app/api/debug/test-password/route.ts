import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'DB not connected' }, { status: 500 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@sabq.org'))
      .limit(1);

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or no password' }, { status: 404 });
    }

    // اختبار كلمة المرور
    const isValid = await bcrypt.compare(password, user.password);

    // إنشاء hash جديد لكلمة المرور المدخلة
    const newHash = await bcrypt.hash(password, 12);

    return NextResponse.json({
      passwordTested: password,
      storedHash: user.password,
      isValid,
      newHashGenerated: newHash,
      hashesMatch: user.password === newHash
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}

