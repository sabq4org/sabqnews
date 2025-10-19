"use client";

import { trpc } from "../../lib/trpc";
import {
  FileText,
  PlusCircle,
  FolderOpen,
  TrendingUp,
  Eye,
  FileEdit
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.articles.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl font-sans">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">مرحباً بك</h2>
        <p className="text-gray-600">نظرة عامة على أداء البوابة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.totalArticles || 0}
          </div>
          <div className="text-sm text-gray-600">إجمالي المقالات</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <FileEdit className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.publishedArticles || 0}
          </div>
          <div className="text-sm text-gray-600">المقالات المنشورة</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FileText className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.draftArticles || 0}
          </div>
          <div className="text-sm text-gray-600">المسودات</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.totalViews?.toLocaleString("ar-SA") || 0}
          </div>
          <div className="text-sm text-gray-600">إجمالي المشاهدات</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/articles/new"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <PlusCircle size={28} />
              </div>
              <div>
                <div className="font-bold text-lg mb-1">كتابة مقال جديد</div>
                <div className="text-sm text-blue-100">ابدأ في إنشاء محتوى جديد</div>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/articles"
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText size={28} />
              </div>
              <div>
                <div className="font-bold text-lg mb-1">إدارة المقالات</div>
                <div className="text-sm text-green-100">عرض وتحرير المقالات</div>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FolderOpen size={28} />
              </div>
              <div>
                <div className="font-bold text-lg mb-1">إدارة التصنيفات</div>
                <div className="text-sm text-purple-100">تنظيم المحتوى</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">النشاط الأخير</h3>
        <div className="text-center py-12 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>لا توجد أنشطة حديثة</p>
        </div>
      </div>
    </>
  );
}

