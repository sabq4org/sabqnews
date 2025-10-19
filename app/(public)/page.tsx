import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { articles, categories } from '@/drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { TrendingUp, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';

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

async function getFeaturedArticles() {
  const db = getDb();
  
  const featuredArticles = await db
    .select({
      article: articles,
      category: categories,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.isFeatured), desc(articles.publishedAt))
    .limit(3);

  return featuredArticles;
}

async function getBreakingNews() {
  const db = getDb();
  
  const breakingNews = await db
    .select({
      article: articles,
      category: categories,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.isBreaking), desc(articles.publishedAt))
    .limit(1);

  return breakingNews;
}

async function getCategories() {
  const db = getDb();
  return await db.select().from(categories).limit(10);
}

export default async function HomePage() {
  const latestArticles = await getLatestArticles();
  const featuredArticles = await getFeaturedArticles();
  const breakingNews = await getBreakingNews();
  const allCategories = await getCategories();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breaking News Banner */}
      {breakingNews.length > 0 && (
        <div className="bg-red-500 text-white py-3 sticky top-0 z-40 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <Zap className="w-5 h-5 flex-shrink-0" />
            <Link href={`/articles/${breakingNews[0].article.slug}`} className="hover:underline flex-1">
              <span className="font-bold">عاجل:</span> {breakingNews[0].article.title}
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-l from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">سبق الإخبارية</h1>
          <p className="text-xl text-primary-100">
            آخر الأخبار والتحليلات من المملكة العربية السعودية والعالم
          </p>
        </div>
      </div>

      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">الأخبار المميزة</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredArticles.map(({ article, category }) => (
              <NewsCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt || ''}
                image={article.featuredImage || '/placeholder.jpg'}
                slug={article.slug}
                category={category?.name || 'عام'}
                date={article.publishedAt || article.createdAt}
                isFeatured={article.isFeatured}
                isBreaking={article.isBreaking}
                variant={featuredArticles[0].article.id === article.id ? 'large' : 'default'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Latest Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">أحدث المقالات</h2>
        </div>

        {latestArticles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد مقالات منشورة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map(({ article, category }) => (
              <NewsCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt || ''}
                image={article.featuredImage || '/placeholder.jpg'}
                slug={article.slug}
                category={category?.name || 'عام'}
                date={article.publishedAt || article.createdAt}
                isFeatured={article.isFeatured}
                isBreaking={article.isBreaking}
                variant="default"
              />
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">الفئات</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="card p-4 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
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

