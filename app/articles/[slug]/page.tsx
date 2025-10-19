import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { getDb } from '@/lib/db';
import { articles, categories, users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Calendar, User, Eye, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import Link from 'next/link';

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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const data = await getArticle(params.slug);

  if (!data) {
    notFound();
  }

  const { article, category, author } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            سبق
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category */}
        {category && (
          <Link
            href={`/categories/${category.slug}`}
            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4 hover:bg-blue-200"
          >
            {category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" dir="rtl">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
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

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <div className="mb-6 p-4 bg-blue-50 border-r-4 border-blue-600 rounded">
            <p className="text-lg text-gray-700 leading-relaxed" dir="rtl">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-8"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: article.content as string }}
        />

        {/* Share */}
        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">شارك المقال</h3>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = article.title;
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    '_blank'
                  );
                }}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                title="مشاركة على فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = article.title;
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    '_blank'
                  );
                }}
                className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600"
                title="مشاركة على تويتر"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = article.title;
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
                    '_blank'
                  );
                }}
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">الوسوم</h3>
            <div className="flex flex-wrap gap-2">
              {(article.tags as string[]).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">© 2025 سبق الإخبارية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

