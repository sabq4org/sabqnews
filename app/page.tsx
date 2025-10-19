"use client";

import Link from "next/link";

// بيانات تجريبية
const mockCategories = [
  { id: "1", name: "أخبار عاجلة", slug: "breaking-news" },
  { id: "2", name: "اقتصاد", slug: "economy" },
  { id: "3", name: "رياضة", slug: "sports" },
  { id: "4", name: "تقنية", slug: "technology" },
  { id: "5", name: "ثقافة", slug: "culture" },
  { id: "6", name: "صحة", slug: "health" },
];

const mockArticles = [
  {
    id: "1",
    title: "انطلاق مؤتمر التقنية السنوي بحضور أكثر من 5000 مشارك",
    slug: "tech-conference-2025",
    excerpt: "شهد المؤتمر السنوي للتقنية والاتصالات انطلاقة قوية بحضور متخصصين من مختلف دول العالم",
    authorId: "author1",
    featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    publishedAt: new Date("2025-10-19"),
    views: 1250,
    likes: 342,
  },
  {
    id: "2",
    title: "توقعات بنمو الاقتصاد بنسبة 4% خلال العام الجاري",
    slug: "economy-growth-2025",
    excerpt: "أعلنت وزارة الاقتصاد عن توقعات إيجابية لنمو الاقتصاد الوطني خلال العام الحالي",
    authorId: "author2",
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
    publishedAt: new Date("2025-10-18"),
    views: 892,
    likes: 156,
  },
  {
    id: "3",
    title: "الفريق الوطني يحقق فوزاً تاريخياً في البطولة الآسيوية",
    slug: "national-team-victory",
    excerpt: "حقق الفريق الوطني لكرة القدم فوزاً مثيراً على نظيره الياباني في نصف نهائي البطولة الآسيوية",
    authorId: "author3",
    featuredImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop",
    publishedAt: new Date("2025-10-17"),
    views: 2156,
    likes: 589,
  },
  {
    id: "4",
    title: "إطلاق تطبيق جديد لتسهيل الخدمات الحكومية الإلكترونية",
    slug: "new-gov-app",
    excerpt: "أطلقت الحكومة تطبيقاً جديداً يوفر جميع الخدمات الحكومية في مكان واحد بسهولة وأمان",
    authorId: "author4",
    featuredImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop",
    publishedAt: new Date("2025-10-16"),
    views: 654,
    likes: 198,
  },
  {
    id: "5",
    title: "اكتشاف علمي جديد في مجال الطب الحديث",
    slug: "medical-breakthrough",
    excerpt: "توصل فريق من الباحثين إلى اكتشاف طبي جديد قد يغير مسار علاج الأمراض المزمنة",
    authorId: "author5",
    featuredImage: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=500&h=300&fit=crop",
    publishedAt: new Date("2025-10-15"),
    views: 1456,
    likes: 412,
  },
  {
    id: "6",
    title: "مهرجان ثقافي عالمي يجمع فنانين من 50 دولة",
    slug: "global-cultural-festival",
    excerpt: "تستضيف العاصمة مهرجاناً ثقافياً عالمياً يشارك فيه فنانون وعازفون من جميع أنحاء العالم",
    authorId: "author6",
    featuredImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
    publishedAt: new Date("2025-10-14"),
    views: 789,
    likes: 267,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">بوابة سبق الذكية</h1>
          <p className="text-gray-600 mt-2">صحيفة سبق الإلكترونية</p>
        </div>

        {/* Navigation */}
        <nav className="border-t bg-white">
          <div className="container mx-auto px-4">
            <ul className="flex gap-6 py-3 overflow-x-auto">
              <li>
                <Link
                  href="/"
                  className="text-blue-600 font-semibold hover:text-blue-800 whitespace-nowrap"
                >
                  الرئيسية
                </Link>
              </li>
              {mockCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Article */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">المقالة المميزة</h2>
          {mockArticles[0] && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {mockArticles[0].featuredImage && (
                  <img
                    src={mockArticles[0].featuredImage}
                    alt={mockArticles[0].title}
                    className="w-full h-64 md:h-auto object-cover"
                  />
                )}
                <div className="md:col-span-2 p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    <Link
                      href={`/article/${mockArticles[0].slug}`}
                      className="hover:text-blue-600"
                    >
                      {mockArticles[0].title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{mockArticles[0].excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>👤 محرر الأخبار</span>
                    <span>📅 {mockArticles[0].publishedAt.toLocaleDateString("ar-SA")}</span>
                  </div>
                  <div className="flex gap-4 mt-4 text-sm text-gray-600">
                    <span>👁️ {mockArticles[0].views} مشاهدة</span>
                    <span>❤️ {mockArticles[0].likes} إعجاب</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Latest Articles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">أحدث الأخبار</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArticles.slice(1).map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.featuredImage && (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    <Link
                      href={`/article/${article.slug}`}
                      className="hover:text-blue-600"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>👤 محرر</span>
                    <span>📅 {article.publishedAt.toLocaleDateString("ar-SA")}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-600">
                    <span>👁️ {article.views}</span>
                    <span>❤️ {article.likes}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">عن البوابة</h3>
              <p className="text-gray-400 text-sm">
                بوابة إعلامية ذكية تقدم أحدث الأخبار والتحليلات مع دعم الذكاء الاصطناعي
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">الأقسام</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                {mockCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="hover:text-white">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">الروابط</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link href="/" className="hover:text-white">الرئيسية</Link></li>
                <li><Link href="/" className="hover:text-white">اتصل بنا</Link></li>
                <li><Link href="/" className="hover:text-white">سياسة الخصوصية</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">تابعنا</h3>
              <div className="flex gap-4 text-gray-400">
                <a href="#" className="hover:text-white">📘 فيسبوك</a>
                <a href="#" className="hover:text-white">𝕏 تويتر</a>
                <a href="#" className="hover:text-white">📷 إنستغرام</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 بوابة سبق الذكية. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              مبنية بـ Next.js 15 | Vercel | Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

