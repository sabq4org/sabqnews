import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

/**
 * تكوين الاتصال بقاعدة البيانات PostgreSQL/Supabase
 * محسّن للعمل مع Vercel Serverless Functions
 */

// الحصول على رابط الاتصال من متغيرات البيئة
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL or POSTGRES_URL environment variable is not set. " +
    "Please configure database connection in Vercel environment variables."
  );
}

/**
 * إنشاء عميل PostgreSQL مع إعدادات محسّنة لـ Serverless
 * 
 * الإعدادات:
 * - prepare: false - تعطيل prepared statements لأنها غير مدعومة مع PgBouncer في وضع Transaction
 * - max: 1 - تحديد عدد الاتصالات لكل Serverless Function instance
 */
const client = postgres(connectionString, {
  prepare: false, // Required for PgBouncer in transaction mode
  max: 1, // Limit connections in serverless environment
  connect_timeout: 30, // Connection timeout in seconds
});

/**
 * إنشاء instance واحد من Drizzle ORM
 * يتم إنشاؤه مرة واحدة عند تحميل الوحدة (module-level singleton)
 */
export const db = drizzle(client, { schema });

/**
 * دالة للحصول على instance قاعدة البيانات
 * @returns Drizzle database instance
 */
export function getDb() {
  return db;
}

