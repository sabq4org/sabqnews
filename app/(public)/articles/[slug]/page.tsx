import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { articles, categories, users } from '@/drizzle/schema';
import { eq, and, ne } from 'drizzle-orm';
import { Calendar, User, Eye, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AISummary from '@/components/AISummary';
import RecommendationsSection from '@/components/RecommendationsSection';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  const db = getDb();
  
  const result = await db
    .select({
      article: articles,
      category: categories,
      author: users,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  return result[0];
}

async function getRelatedArticles(articleId: string, categoryId: string | null) {
  const db = getDb();
  
  if (!categoryId) return [];

  const relatedArticles = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      featuredImage: articles.featuredImage,
      publishedAt: articles.publishedAt,
      category: categories.name,
      isFeatured: articles.isFeatured,
      isBreaking: articles.isBreaking,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(and(eq(articles.categoryId, categoryId), ne(articles.id, articleId)))
    .limit(3);

  return relatedArticles;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const data = await getArticle(params.slug);

  if (!data) {
    notFound();
  }

  const { article, category, author } = data;
  const relatedArticles = await getRelatedArticles(article.id, article.categoryId);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category */}
        {category && (
          <Link
            href={`/categories/${category.slug}`}
            className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium mb-4 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            {category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" dir="rtl">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          {author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{author.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{article.views || 0} مشاهدة</span>
          </div>
        </div>

        {/* AI Summary */}
        <AISummary summary={article.excerpt || ''} />

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="my-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-8 dark:prose-invert"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: article.content as string }}
        />

        {/* Share */}
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">شارك المقال</h3>
            <div className="flex gap-3">
              <button
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                title="مشاركة على فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                title="مشاركة على تويتر"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                title="مشاركة على واتساب"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">الوسوم</h3>
            <div className="flex flex-wrap gap-2">
              {(article.tags as string[]).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      <RecommendationsSection articles={relatedArticles} title="مقالات ذات صلة" />
    </div>
  );
}

