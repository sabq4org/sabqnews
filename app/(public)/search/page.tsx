'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { Search, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const { data, isLoading } = trpc.articles.list.useQuery(
    {
      search: searchTerm || undefined,
      status: 'published',
      limit: 20,
      offset: 0,
    },
    {
      enabled: searchTerm.length > 0,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

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

      {/* Search Section */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6 text-center">البحث في المقالات</h1>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن مقال..."
              className="w-full px-6 py-4 pr-14 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              dir="rtl"
            />
            <button
              type="submit"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!searchTerm ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">أدخل كلمة للبحث</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري البحث...</p>
          </div>
        ) : !data || data.articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              لم يتم العثور على نتائج لـ &quot;{searchTerm}&quot;
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                تم العثور على <span className="font-semibold">{data.total}</span> نتيجة لـ &quot;
                {searchTerm}&quot;
              </p>
            </div>

            <div className="space-y-6">
              {data.articles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    {article.featuredImage && (
                      <div className="flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <h2
                        className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
                        dir="rtl"
                      >
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p className="text-gray-600 mb-3 line-clamp-2" dir="rtl">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                              'ar-SA',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views || 0} مشاهدة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

