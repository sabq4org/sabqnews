"use client";

import { trpc } from "../../lib/trpc";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.articles.stats.useQuery();

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
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التحكم - بوابة سبق الذكية</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            العودة للموقع
          </Link>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <ul className="flex gap-6 py-3">
            <li>
              <Link href="/admin" className="text-blue-600 font-semibold">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/admin/articles" className="text-gray-700 hover:text-blue-600">
                المقالات
              </Link>
            </li>
            <li>
              <Link href="/admin/articles/new" className="text-gray-700 hover:text-blue-600">
                مقال جديد
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="text-gray-700 hover:text-blue-600">
                التصنيفات
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">إجمالي المقالات</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats?.totalArticles || 0}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">المقالات المنشورة</div>
            <div className="text-3xl font-bold text-green-600">
              {stats?.publishedArticles || 0}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">المسودات</div>
            <div className="text-3xl font-bold text-yellow-600">
              {stats?.draftArticles || 0}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">إجمالي المشاهدات</div>
            <div className="text-3xl font-bold text-purple-600">
              {stats?.totalViews || 0}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/articles/new"
              className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition"
            >
              ✍️ كتابة مقال جديد
            </Link>
            <Link
              href="/admin/articles"
              className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition"
            >
              📄 إدارة المقالات
            </Link>
            <Link
              href="/admin/categories"
              className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition"
            >
              📁 إدارة التصنيفات
            </Link>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">آخر المقالات</h2>
          <div className="text-gray-600">قريباً...</div>
        </div>
      </main>
    </div>
  );
}

