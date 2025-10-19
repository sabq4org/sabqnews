"use client";

import { trpc } from "../lib/trpc";
import Link from "next/link";

export default function Home() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery({
    limit: 10,
    offset: 0,
  });

  const { data: categories } = trpc.categories.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">بوابة سبق الذكية</h1>
          <p className="text-gray-600 mt-2">صحيفة سبق الإلكترونية</p>
        </div>

        {/* Navigation */}
        <nav className="border-t">
          <div className="container mx-auto px-4">
            <ul className="flex gap-6 py-3 overflow-x-auto">
              <li>
                <Link
                  href="/"
                  className="text-blue-600 font-semibold hover:text-blue-800"
                >
                  الرئيسية
                </Link>
              </li>
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-700 hover:text-blue-600"
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
        <h2 className="text-2xl font-bold mb-6">أحدث الأخبار</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => (
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
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
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
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.authorName}</span>
                  <span>
                    {new Date(article.publishedAt || "").toLocaleDateString(
                      "ar-SA"
                    )}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">بوابة سبق الذكية</h3>
            <p className="text-gray-400">
              © 2025 بوابة سبق الذكية. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

