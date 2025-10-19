import { getDb } from '../lib/db';
import { categories } from '../drizzle/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

const officialCategories = [
  {
    name: 'محليات',
    nameEn: 'Local',
    slug: 'local',
    description: 'أخبار المناطق والمدن السعودية',
    iconUrl: '🗺️',
    color: '#3B82F6',
    displayOrder: 1,
  },
  {
    name: 'العالم',
    nameEn: 'World',
    slug: 'world',
    description: 'أخبار العالم والتحليلات الدولية',
    iconUrl: '🌍',
    color: '#6366F1',
    displayOrder: 2,
  },
  {
    name: 'حياتنا',
    nameEn: 'Life',
    slug: 'life',
    description: 'نمط الحياة، الصحة، الأسرة والمجتمع',
    iconUrl: '🌱',
    color: '#F472B6',
    displayOrder: 3,
  },
  {
    name: 'محطات',
    nameEn: 'Stations',
    slug: 'stations',
    description: 'تقارير خاصة وملفات متنوعة',
    iconUrl: '🛤️',
    color: '#FBBF24',
    displayOrder: 4,
  },
  {
    name: 'رياضة',
    nameEn: 'Sports',
    slug: 'sports',
    description: 'أخبار رياضية محلية وعالمية',
    iconUrl: '⚽',
    color: '#F59E0B',
    displayOrder: 5,
  },
  {
    name: 'سياحة',
    nameEn: 'Tourism',
    slug: 'tourism',
    description: 'تقارير سياحية ومواقع مميزة',
    iconUrl: '🧳',
    color: '#34D399',
    displayOrder: 6,
  },
  {
    name: 'أعمال',
    nameEn: 'Business',
    slug: 'business',
    description: 'أخبار الأعمال والشركات وريادة الأعمال',
    iconUrl: '💼',
    color: '#10B981',
    displayOrder: 7,
  },
  {
    name: 'تقنية',
    nameEn: 'Technology',
    slug: 'technology',
    description: 'أخبار وتطورات التقنية والذكاء الاصطناعي',
    iconUrl: '💻',
    color: '#8B5CF6',
    displayOrder: 8,
  },
  {
    name: 'سيارات',
    nameEn: 'Cars',
    slug: 'cars',
    description: 'أخبار وتقارير السيارات',
    iconUrl: '🚗',
    color: '#0EA5E9',
    displayOrder: 9,
  },
  {
    name: 'ميديا',
    nameEn: 'Media',
    slug: 'media',
    description: 'فيديوهات وصور وإعلام رقمي',
    iconUrl: '🎬',
    color: '#EAB308',
    displayOrder: 10,
  },
];

async function seedCategories() {
  console.log('🌱 بدء إضافة التصنيفات الرسمية...');

  const db = await getDb();
  if (!db) {
    console.error('❌ فشل الاتصال بقاعدة البيانات');
    return;
  }

  for (const category of officialCategories) {
    try {
      // التحقق من وجود التصنيف
      const [existing] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category.slug))
        .limit(1);

      if (existing) {
        console.log(`⚠️  التصنيف موجود بالفعل: ${category.name}`);
        continue;
      }

      const categoryId = nanoid();
      await db.insert(categories).values({
        id: categoryId,
        name: category.name,
        slug: category.slug,
        description: category.description,
        iconUrl: category.iconUrl,
        color: category.color,
        displayOrder: category.displayOrder,
        isActive: true,
      });

      console.log(`✅ تم إضافة التصنيف: ${category.name} (${category.nameEn})`);
    } catch (error: any) {
      console.error(`❌ خطأ في إضافة التصنيف ${category.name}:`, error.message);
    }
  }

  console.log('✨ اكتملت عملية إضافة التصنيفات!');
}

seedCategories();

