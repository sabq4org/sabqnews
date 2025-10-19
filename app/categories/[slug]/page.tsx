import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { getDb } from '@/lib/db';
import { articles, categories } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getCategoryWithArticles(slug: string) {
  const db = getDb();

  // Get category
  const categoryResult = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!categoryResult || categoryResult.length === 0) {
    return null;
  }

  const category = categoryResult[0];

  // Get articles in this category
  const categoryArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.categoryId, category.id))
    .orderBy(desc(articles.publishedAt))
    .limit(20);

  return {
    category,
    articles: categoryArticles,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const data = await getCategoryWithArticles(params.slug);

  if (!data) {
    notFound();
  }

  const { category, articles: categoryArticles } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Category Header */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" dir="rtl">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-blue-100" dir="rtl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoryArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد مقالات في هذه الفئة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryArticles.map((article) => (
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
                <div className="p-4">
                  <h2
                    className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                    dir="rtl"
                  >
                    {article.title}
                  </h2>

                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2" dir="rtl">
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

      <Footer />
    </div>
  );
}

