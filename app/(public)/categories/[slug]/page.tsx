import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { getDb } from '@/lib/db';
import { articles, categories } from '@/drizzle/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { Calendar, Eye, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


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
  console.log("Category data (server-side):", category);

  // Get articles in this category
  const categoryArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.categoryId, category.id))
    .orderBy(desc(articles.publishedAt))
    .limit(20);

  // Calculate total views for the category
  const totalViewsResult = await db
    .select({ totalViews: sql<number>`sum(${articles.views})` })
    .from(articles)
    .where(eq(articles.categoryId, category.id));

  const totalViews = totalViewsResult[0]?.totalViews || 0;

  return {
    category: { ...category, totalViews }, // Add totalViews to category object
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


      {/* Category Header */}
      {/* Remove py-12 to connect directly to header */}
      <div className="relative text-white overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
        {/* Adjust height and remove padding/margin from top */}
        <div className="relative h-72 md:h-96 flex items-center justify-center pt-12 md:pt-16">
          {category.heroImage && (
            <Image
              src={category.heroImage}
              alt={category.name}
              fill
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
            />
          )}
          <div className="relative z-10 text-center text-white p-4 bg-black bg-opacity-60 rounded-lg shadow-lg mx-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 drop-shadow-lg" dir="rtl">
              {category.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-base md:text-xl text-blue-100">
              <span dir="rtl"><FileText className="inline-block w-5 h-5 ml-1" /> {categoryArticles.length} مقال</span>
              <span dir="rtl"><Eye className="inline-block w-5 h-5 ml-1" /> {category.totalViews || 0} مشاهدة</span>
            </div>
            {category.description && (
              <p className="text-base md:text-xl text-blue-100 mt-2 max-w-2xl mx-auto" dir="rtl">
                {category.description}
              </p>
            )}
          </div>
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


    </div>
  );
}

