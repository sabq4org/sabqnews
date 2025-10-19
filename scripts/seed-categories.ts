import { db } from '../lib/db';
import { categories } from '../drizzle/schema';

async function seedCategories() {
  const defaultCategories = [
    { name: 'محليات', slug: 'local', description: 'الأخبار المحلية', color: '#3B82F6' },
    { name: 'عالمية', slug: 'world', description: 'الأخبار العالمية', color: '#10B981' },
    { name: 'اقتصاد', slug: 'economy', description: 'الأخبار الاقتصادية', color: '#F59E0B' },
    { name: 'رياضة', slug: 'sports', description: 'الأخبار الرياضية', color: '#EF4444' },
    { name: 'تقنية', slug: 'tech', description: 'أخبار التقنية والتكنولوجيا', color: '#8B5CF6' },
    { name: 'صحة', slug: 'health', description: 'الأخبار الصحية', color: '#EC4899' },
    { name: 'ثقافة', slug: 'culture', description: 'الأخبار الثقافية', color: '#14B8A6' },
    { name: 'منوعات', slug: 'misc', description: 'أخبار منوعة', color: '#6B7280' },
  ];

  try {
    for (const category of defaultCategories) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }
    console.log('✅ تم إضافة الفئات الافتراضية بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إضافة الفئات:', error);
  }
}

seedCategories();
