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
      <div className="relative text-white overflow-hidden bg-gray-900">
        <div className="relative h-72 md:h-96 flex items-center justify-center pt-12 md:pt-16 px-4">
          {category.heroImage && (
            <>
              <Image
                src={category.heroImage}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-40 transition-opacity duration-300"
                unoptimized // Added unoptimized to bypass Next.js Image optimization for external URLs
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </>
          )}
          {/* Container for category name, description, and stats */}
          <div className="relative z-10 text-center text-white max-w-4xl w-full mx-auto p-4 md:p-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-3 drop-shadow-lg leading-tight p-2 text-shadow-lg" dir="rtl">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg md:text-2xl text-gray-200 mt-4 max-w-2xl mx-auto leading-relaxed p-2 text-shadow-md" dir="rtl">
                {category.description}
              </p>
            )}
            {/* Transparent label for stats */}
            {/* Transparent labels for stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <span dir="rtl" className="flex items-center text-lg md:text-xl text-white px-5 py-2 bg-black bg-opacity-40 rounded-full shadow-md">
                <FileText className="inline-block w-5 h-5 ml-2" /> {categoryArticles.length} مقال
              </span>
              <span dir="rtl" className="flex items-center text-lg md:text-xl text-white px-5 py-2 bg-black bg-opacity-40 rounded-full shadow-md">
                <Eye className="inline-block w-5 h-5 ml-2" /> {category.totalViews || 0} مشاهدة
              </span>
            </div>
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

