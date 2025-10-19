import postgres from "postgres";
import { nanoid } from "nanoid";

const DATABASE_URL = process.env.DATABASE_URL || "";

async function seed() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  console.log("🌱 بدء إضافة البيانات التجريبية...");

  try {
    // حذف البيانات القديمة
    await sql`DELETE FROM articles`;
    await sql`DELETE FROM categories`;
    await sql`DELETE FROM users`;

    // إضافة مستخدم تجريبي
    const userId = nanoid();
    await sql`
      INSERT INTO users (id, name, email, role, is_active)
      VALUES (${userId}, 'محرر الأخبار', 'editor@sabq.org', 'admin', true)
    `;

    // إضافة التصنيفات
    const categories = [
      { id: nanoid(), name: "أخبار عاجلة", slug: "breaking-news", displayOrder: 1 },
      { id: nanoid(), name: "اقتصاد", slug: "economy", displayOrder: 2 },
      { id: nanoid(), name: "رياضة", slug: "sports", displayOrder: 3 },
      { id: nanoid(), name: "تقنية", slug: "technology", displayOrder: 4 },
      { id: nanoid(), name: "ثقافة", slug: "culture", displayOrder: 5 },
      { id: nanoid(), name: "صحة", slug: "health", displayOrder: 6 },
    ];

    for (const cat of categories) {
      await sql`
        INSERT INTO categories (id, name, slug, display_order, is_active)
        VALUES (${cat.id}, ${cat.name}, ${cat.slug}, ${cat.displayOrder}, true)
      `;
    }

    // إضافة مقالات تجريبية
    const articles = [
      {
        id: nanoid(),
        title: "انطلاق مؤتمر التقنية السنوي بحضور أكثر من 5000 مشارك",
        slug: "tech-conference-2025",
        content: "شهد المؤتمر السنوي للتقنية والاتصالات انطلاقة قوية بحضور متخصصين من مختلف دول العالم. تناول المؤتمر أحدث التطورات في مجالات الذكاء الاصطناعي والحوسبة السحابية.",
        excerpt: "شهد المؤتمر السنوي للتقنية والاتصالات انطلاقة قوية بحضور متخصصين من مختلف دول العالم",
        categoryId: categories[3].id,
        featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
        views: 1250,
        likes: 342,
      },
      {
        id: nanoid(),
        title: "توقعات بنمو الاقتصاد بنسبة 4% خلال العام الجاري",
        slug: "economy-growth-2025",
        content: "أعلنت وزارة الاقتصاد عن توقعات إيجابية لنمو الاقتصاد الوطني خلال العام الحالي بنسبة 4%، مدعومة بزيادة الاستثمارات وتحسن الصادرات.",
        excerpt: "أعلنت وزارة الاقتصاد عن توقعات إيجابية لنمو الاقتصاد الوطني خلال العام الحالي",
        categoryId: categories[1].id,
        featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
        views: 892,
        likes: 156,
      },
      {
        id: nanoid(),
        title: "الفريق الوطني يحقق فوزاً تاريخياً في البطولة الآسيوية",
        slug: "national-team-victory",
        content: "حقق الفريق الوطني لكرة القدم فوزاً مثيراً على نظيره الياباني بنتيجة 3-2 في نصف نهائي البطولة الآسيوية، ليضمن تأهله للمباراة النهائية.",
        excerpt: "حقق الفريق الوطني لكرة القدم فوزاً مثيراً على نظيره الياباني في نصف نهائي البطولة الآسيوية",
        categoryId: categories[2].id,
        featuredImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=500&fit=crop",
        views: 2156,
        likes: 589,
        isFeatured: true,
      },
      {
        id: nanoid(),
        title: "إطلاق تطبيق جديد لتسهيل الخدمات الحكومية الإلكترونية",
        slug: "new-gov-app",
        content: "أطلقت الحكومة تطبيقاً جديداً يوفر جميع الخدمات الحكومية في مكان واحد بسهولة وأمان، مع واجهة مستخدم عصرية وبسيطة.",
        excerpt: "أطلقت الحكومة تطبيقاً جديداً يوفر جميع الخدمات الحكومية في مكان واحد بسهولة وأمان",
        categoryId: categories[3].id,
        featuredImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop",
        views: 654,
        likes: 198,
      },
      {
        id: nanoid(),
        title: "اكتشاف علمي جديد في مجال الطب الحديث",
        slug: "medical-breakthrough",
        content: "توصل فريق من الباحثين إلى اكتشاف طبي جديد قد يغير مسار علاج الأمراض المزمنة، بعد سنوات من الأبحاث المكثفة.",
        excerpt: "توصل فريق من الباحثين إلى اكتشاف طبي جديد قد يغير مسار علاج الأمراض المزمنة",
        categoryId: categories[5].id,
        featuredImage: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&h=500&fit=crop",
        views: 1456,
        likes: 412,
      },
      {
        id: nanoid(),
        title: "مهرجان ثقافي عالمي يجمع فنانين من 50 دولة",
        slug: "global-cultural-festival",
        content: "تستضيف العاصمة مهرجاناً ثقافياً عالمياً يشارك فيه فنانون وعازفون من جميع أنحاء العالم، في احتفالية تستمر لمدة أسبوع كامل.",
        excerpt: "تستضيف العاصمة مهرجاناً ثقافياً عالمياً يشارك فيه فنانون وعازفون من جميع أنحاء العالم",
        categoryId: categories[4].id,
        featuredImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop",
        views: 789,
        likes: 267,
      },
    ];

    for (const article of articles) {
      await sql`
        INSERT INTO articles (
          id, title, slug, content, excerpt, author_id, category_id,
          status, featured_image, views, likes, is_featured, published_at
        )
        VALUES (
          ${article.id}, ${article.title}, ${article.slug}, ${article.content},
          ${article.excerpt}, ${userId}, ${article.categoryId}, 'published',
          ${article.featuredImage}, ${article.views}, ${article.likes},
          ${article.isFeatured || false}, NOW()
        )
      `;
    }

    console.log("✅ تم إضافة البيانات التجريبية بنجاح!");
    console.log(`   - ${categories.length} تصنيفات`);
    console.log(`   - ${articles.length} مقالات`);
    console.log(`   - 1 مستخدم`);

  } catch (error) {
    console.error("❌ خطأ في إضافة البيانات:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

seed();

