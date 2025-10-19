import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { articles, categories } from '@/drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { Calendar, Eye, TrendingUp, Search } from 'lucide-react';

import Link from 'next/link';

async function getLatestArticles() {
  const db = getDb();
  
  const latestArticles = await db
    .select({
      article: articles,
      category: categories,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(12);

  return latestArticles;
}

async function getCategories() {
  const db = getDb();
  return await db.select().from(categories).limit(10);
}

export default async function HomePage() {
  const latestArticles = await getLatestArticles();
  const allCategories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero Section */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">بوابة سبق الإخبارية</h1>
          <p className="text-xl text-blue-100">
            آخر الأخبار والتحليلات من المملكة العربية السعودية والعالم
          </p>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">أحدث المقالات</h2>
        </div>

        {latestArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">لا توجد مقالات منشورة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map(({ article, category }) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Image */}
                {article.featuredImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Category Badge */}
                  {category && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium mb-2">
                      {category.name}
                    </span>
                  )}

                  <h3
                    className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                    dir="rtl"
                  >
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3" dir="rtl">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                          'ar-SA',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">الفئات</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="p-4 bg-gray-50 rounded-lg text-center hover:bg-blue-50 hover:text-blue-600 transition-colors group"
              >
                <h3 className="font-semibold text-lg">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}

