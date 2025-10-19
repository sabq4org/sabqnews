import { getDb } from "@/lib/db";
import { categories, articles } from "@/drizzle/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import DynamicIcon, { IconName } from "@/components/DynamicIcon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

async function getAllCategoriesWithArticleCount() {
  const db = getDb();

  const categoriesData = await db.select().from(categories);

  const categoriesWithCounts = await Promise.all(
    categoriesData.map(async (category) => {
      const articleCountResult = await db
        .select({ count: count() })
        .from(articles)
        .where(eq(articles.categoryId, category.id));
      const articleCount = articleCountResult[0]?.count || 0;
      return { ...category, articleCount };
    })
  );

  return categoriesWithCounts;
}

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithArticleCount();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md" dir="rtl">
            اكتشف تصنيفاتنا
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto drop-shadow" dir="rtl">
            تصفح مجموعتنا الواسعة من التصنيفات الإخبارية لتجد ما يثير اهتمامك.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg dark:text-gray-400">لا توجد تصنيفات متاحة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 w-full">
                  {category.heroImage && category.heroImage.startsWith("http") ? (
                    <Image
                      src={category.heroImage}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: `linear-gradient(135deg, ${category.color || '#3b82f6'} 0%, ${category.color || '#1e40af'} 100%)` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                    <div className="text-center">
                      {category.icon && (
                        <div className="mb-2">
                          <DynamicIcon
                            name={category.icon as IconName}
                            className="mx-auto w-12 h-12 text-white filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                          />
                        </div>
                      )}
                      <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-lg" dir="rtl">
                        {category.name}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
                        <FileText className="w-4 h-4" />
                        <span>{category.articleCount} مقال</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>


      <Footer />
    </div>
  );
}

