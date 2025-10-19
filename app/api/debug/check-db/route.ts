import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = await getDb();
    
    if (!db) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        dbConnected: false
      });
    }

    // محاولة البحث عن المستخدم admin
    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@sabq.org'))
      .limit(1);

    // عد جميع المستخدمين
    const allUsers = await db.select().from(users);

    return NextResponse.json({
      status: 'success',
      dbConnected: true,
      adminUserExists: !!adminUser,
      adminUserDetails: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        hasPassword: !!adminUser.password,
        isActive: adminUser.isActive
      } : null,
      totalUsers: allUsers.length,
      allUserEmails: allUsers.map((u: any) => u.email)
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      dbConnected: false
    }, { status: 500 });
  }
}

