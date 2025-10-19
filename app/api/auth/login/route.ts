import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, setSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      console.error('[Login] Database connection failed');
      return NextResponse.json(
        { error: 'خطأ في الاتصال بقاعدة البيانات' },
        { status: 500 }
      );
    }

    console.log('[Login] Searching for user:', email);

    // البحث عن المستخدم
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log('[Login] User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('[Login] User details:', {
        id: user.id,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password
      });
    }

    if (!user) {
      console.error('[Login] User not found for email:', email);
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    if (!user.password) {
      return NextResponse.json(
        { error: 'حساب غير صالح' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من أن الحساب نشط
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'الحساب معطل - يرجى التواصل مع الإدارة' },
        { status: 403 }
      );
    }

    // إنشاء الجلسة
    await setSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}

