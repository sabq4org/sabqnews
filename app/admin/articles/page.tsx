'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { Plus, Search, Filter, Edit, Trash2, Eye, Star, Zap } from 'lucide-react';

export default function ArticlesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, refetch } = trpc.articles.list.useQuery({
    search: search || undefined,
    status: statusFilter as any || undefined,
    limit,
    offset: page * limit,
  });

  // تحميل الفئات - معطل مؤقتاً
  // const { data: categoriesData } = trpc.categories.list.useQuery({});
  const categories: any[] = []; // categoriesData?.categories || [];

  // دالة للحصول على اسم الفئة من ID
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const deleteArticle = trpc.articles.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert('تم حذف المقال بنجاح');
    },
    onError: (error) => {
      alert('حدث خطأ: ' + error.message);
    },
  });

  const updateArticle = trpc.articles.update.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      alert('حدث خطأ: ' + error.message);
    },
  });

  const toggleFeatured = async (article: any) => {
    await updateArticle.mutateAsync({
      id: article.id,
      isFeatured: !article.isFeatured,
    });
  };

  const toggleBreaking = async (article: any) => {
    await updateArticle.mutateAsync({
      id: article.id,
      isBreaking: !article.isBreaking,
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف المقال "${title}"؟`)) {
      await deleteArticle.mutateAsync({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-600 text-white',
      killed: 'bg-red-100 text-red-800',
    };

    const labels = {
      draft: 'مسودة',
      review: 'قيد المراجعة',
      approved: 'معتمد',
      scheduled: 'مجدول',
      published: 'منشور',
      killed: 'ملغي',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">المقالات</h1>
        <button
          onClick={() => router.push('/admin/articles/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          مقال جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مقال..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dir="rtl"
            />
          </div>

          {/* Status Filter */}
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dir="rtl"
            >
              <option value="">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="review">قيد المراجعة</option>
              <option value="approved">معتمد</option>
              <option value="scheduled">مجدول</option>
              <option value="published">منشور</option>
              <option value="killed">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
        ) : !data?.articles || data.articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد مقالات</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" dir="rtl">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الفئة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المشاهدات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    خبر عاجل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.articles.map((article: any) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {article.featuredImage && (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-12 h-12 rounded object-cover ml-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                          {article.excerpt && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {article.excerpt}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(article.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleBreaking(article)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          article.isBreaking ? 'bg-red-600' : 'bg-gray-200'
                        }`}
                        title={article.isBreaking ? 'خبر عاجل' : 'خبر عادي'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            article.isBreaking ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFeatured(article)}
                          className={`p-2 rounded ${
                            article.isFeatured
                              ? 'text-yellow-500 hover:bg-yellow-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={article.isFeatured ? 'إلغاء التمييز' : 'تمييز الخبر'}
                        >
                          <Star className={`w-4 h-4 ${
                            article.isFeatured ? 'fill-yellow-500' : ''
                          }`} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/articles/${article.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="تحرير"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="معاينة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total > limit && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              عرض {page * limit + 1} - {Math.min((page + 1) * limit, data.total)} من {data.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                السابق
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * limit >= data.total}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

