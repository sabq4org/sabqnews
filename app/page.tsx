"use client";

import { trpc } from "../lib/trpc";
import Link from "next/link";
import type { Category, Article } from "../drizzle/schema";

export default function Home() {
  const { data: articles, isLoading: articlesLoading } = trpc.articles.list.useQuery({
    limit: 10,
    offset: 0,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = trpc.categories.list.useQuery({});
  const categories = categoriesData?.categories || [];

  if (articlesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">جاري التحميل...</div>
        </div>
      </div>
    );
  }

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
              {categories?.map((category: Category) => (
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
        {articles && articles.articles.length > 0 ? (
          <>
            {/* Featured Article */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">المقالة المميزة</h2>
              {articles.articles[0] && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {articles.articles[0].featuredImage && (
                      <img
                        src={articles.articles[0].featuredImage}
                        alt={articles.articles[0].title}
                        className="w-full h-64 md:h-auto object-cover"
                      />
                    )}
                    <div className="md:col-span-2 p-6">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        <Link
                          href={`/article/${articles.articles[0].slug}`}
                          className="hover:text-blue-600"
                        >
                          {articles.articles[0].title}
                        </Link>
                      </h3>
                      {articles.articles[0].excerpt && (
                        <p className="text-gray-600 mb-4">{articles.articles[0].excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>👤 {articles.articles[0].authorId}</span>
                        <span>
                          📅{" "}
                          {articles.articles[0].publishedAt
                            ? new Date(articles.articles[0].publishedAt).toLocaleDateString("ar-SA")
                            : ""}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-4 text-sm text-gray-600">
                        <span>👁️ {articles.articles[0].views || 0} مشاهدة</span>
                        <span>❤️ {articles.articles[0].likes || 0} إعجاب</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {articles[0].featuredImage && (
                      <img
                        src={articles[0].featuredImage}
                        alt={articles[0].title}
                        className="w-full h-64 md:h-auto object-cover"
                      />
                    )}
                    <div className="md:col-span-2 p-6">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        <Link
                          href={`/article/${articles[0].slug}`}
                          className="hover:text-blue-600"
                        >
                          {articles[0].title}
                        </Link>
                      </h3>
                      {articles[0].excerpt && (
                        <p className="text-gray-600 mb-4">{articles[0].excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>👤 {articles[0].authorId}</span>
                        <span>
                          📅{" "}
                          {articles[0].publishedAt
                            ? new Date(articles[0].publishedAt).toLocaleDateString("ar-SA")
                            : ""}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-4 text-sm text-gray-600">
                        <span>👁️ {articles[0].views || 0} مشاهدة</span>
                        <span>❤️ {articles[0].likes || 0} إعجاب</span>
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
                {articles.articles.slice(1).map((article: Article) => (
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
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>👤 {article.authorId}</span>
                        <span>
                          📅{" "}
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("ar-SA")
                            : ""}
                        </span>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-600">
                        <span>👁️ {article.views || 0}</span>
                        <span>❤️ {article.likes || 0}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">لا توجد مقالات منشورة حالياً</p>
          </div>
        )}
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
                {categories?.slice(0, 6).map((cat: Category) => (
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
                <li>
                  <Link href="/" className="hover:text-white">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    سياسة الخصوصية
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">تابعنا</h3>
              <div className="flex gap-4 text-gray-400">
                <a href="#" className="hover:text-white">
                  📘 فيسبوك
                </a>
                <a href="#" className="hover:text-white">
                  𝕏 تويتر
                </a>
                <a href="#" className="hover:text-white">
                  📷 إنستغرام
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2025 بوابة سبق الذكية. جميع الحقوق محفوظة.</p>
            <p className="text-gray-500 text-sm mt-2">
              مبنية بـ Next.js 15 | Vercel | Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

