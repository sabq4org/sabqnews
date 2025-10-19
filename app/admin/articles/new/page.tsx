'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import RichTextEditor from '../../components/RichTextEditor';
import AIAssistant from '../../components/AIAssistant';
import { ArrowRight, Save, Eye } from 'lucide-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = trpc.categories.list.useQuery();
  const createArticle = trpc.articles.create.useMutation();

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (status: 'draft' | 'review') => {
    if (!title || !content) {
      alert('الرجاء إدخال العنوان والمحتوى');
      return;
    }

    setIsSubmitting(true);

    try {
      const article = await createArticle.mutateAsync({
        title,
        slug: slug || generateSlug(title),
        content,
        excerpt,
        categoryId: categoryId || undefined,
        featuredImage: featuredImage || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      });

      // تغيير الحالة إذا كانت review
      if (status === 'review') {
        // سيتم إضافة endpoint لتغيير الحالة
      }

      alert('تم إنشاء المقال بنجاح!');
      router.push('/admin/articles');
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">مقال جديد</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            حفظ كمسودة
          </button>
          <button
            onClick={() => handleSubmit('review')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            إرسال للمراجعة
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="أدخل عنوان المقال"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الرابط (Slug)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="article-slug"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="ltr"
          />
          <p className="text-sm text-gray-500 mt-1">
            سيتم إنشاؤه تلقائياً من العنوان إذا تُرك فارغاً
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفئة
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          >
            <option value="">اختر فئة</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الصورة البارزة
          </label>
          <input
            type="url"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="ltr"
          />
          {featuredImage && (
            <div className="mt-3">
              <img
                src={featuredImage}
                alt="معاينة"
                className="max-w-xs rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المقتطف
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="ملخص قصير للمقال (اختياري)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
        </div>

        {/* AI Assistant */}
        <AIAssistant
          title={title}
          content={content}
          onApplySummary={(summary) => setExcerpt(summary)}
          onApplyTitle={(newTitle) => setTitle(newTitle)}
          onApplySEO={(description) => setSeoDescription(description)}
        />

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المحتوى *
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="ابدأ كتابة المقال..."
          />
        </div>

        {/* SEO Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">تحسين محركات البحث (SEO)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان SEO
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="عنوان مخصص لمحركات البحث"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              />
              <p className="text-sm text-gray-500 mt-1">
                سيتم استخدام العنوان الرئيسي إذا تُرك فارغاً
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف SEO
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="وصف مخصص لمحركات البحث"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end border-t pt-6">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            حفظ كمسودة
          </button>
          <button
            onClick={() => handleSubmit('review')}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            إرسال للمراجعة
          </button>
        </div>
      </div>
    </div>
  );
}

