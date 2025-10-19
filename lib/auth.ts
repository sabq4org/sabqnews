import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this'
);

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: 'admin' | 'editor' | 'writer' | 'user';
  isActive: boolean;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * إنشاء Access Token (صلاحية 15 دقيقة)
 */
export async function createAccessToken(user: User): Promise<string> {
  return await new SignJWT({ 
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

/**
 * إنشاء Refresh Token (صلاحية 7 أيام)
 */
export async function createRefreshToken(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET);
}

/**
 * التحقق من Access Token
 */
export async function verifyAccessToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.userId as string,
      name: payload.name as string | null,
      email: payload.email as string | null,
      role: payload.role as 'admin' | 'editor' | 'writer' | 'user',
      isActive: true
    };
  } catch (error) {
    return null;
  }
}

/**
 * التحقق من Refresh Token
 */
export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

/**
 * تشفير كلمة المرور
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * التحقق من كلمة المرور
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * الحصول على الجلسة الحالية من الكوكيز
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken) {
    return null;
  }

  const user = await verifyAccessToken(accessToken);
  
  if (!user) {
    return null;
  }

  return {
    user,
    accessToken,
    refreshToken: refreshToken || '',
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 دقيقة
  };
}

/**
 * حفظ الجلسة في الكوكيز
 */
export async function setSession(user: User): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = await createAccessToken(user);
  const refreshToken = await createRefreshToken(user.id);

  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 دقيقة
    path: '/'
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 أيام
    path: '/'
  });
}

/**
 * حذف الجلسة (تسجيل الخروج)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

/**
 * التحقق من الصلاحيات
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    'user': 0,
    'writer': 1,
    'editor': 2,
    'admin': 3
  };

  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

/**
 * Middleware للتحقق من الصلاحيات
 */
export async function requireAuth(requiredRole: string = 'user'): Promise<User> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('غير مصرح - يجب تسجيل الدخول');
  }

  if (!hasPermission(session.user.role, requiredRole)) {
    throw new Error('غير مصرح - صلاحيات غير كافية');
  }

  return session.user;
}

