'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import RichTextEditor from '../../components/RichTextEditor';
import AIAssistant from '../../components/AIAssistant';
import { Save, Send, Upload, X, Eye, Star, Zap } from 'lucide-react';


export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  // Fetch categories
  const { data: categoriesData } = trpc.categories.list.useQuery({});
  const categories = categoriesData?.categories || [];

  // Mutations
  const createArticle = trpc.articles.create.useMutation({
    onSuccess: () => {
      router.push('/admin/articles');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFeaturedImage('');
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };



  const handleSubmit = async (status: 'draft' | 'review' | 'published') => {
    if (!title || !content || !categoryId) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      let finalImage = featuredImage;

      // رفع الصورة إلى Vercel Blob إذا كان هناك ملف جديد
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'فشل رفع الصورة');
        }

        const uploadData = await uploadResponse.json();
        finalImage = uploadData.url;
      }



      createArticle.mutate({
        title,

        content,
        excerpt: excerpt || undefined,
        categoryId,
        featuredImage: finalImage || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        seoKeywords: keywords.length > 0 ? keywords : undefined,
        status,
        subtitle: subtitle || undefined,
        tags: keywords.length > 0 ? keywords : undefined,
        isFeatured,
        isBreaking,
      });
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
      console.error('Error submitting article:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إنشاء مقال جديد</h1>
          <p className="text-gray-600 mt-2">أضف مقالاً جديداً إلى بوابة سبق</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان الرئيسي <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="أدخل عنوان المقال..."
                dir="rtl"
              />
            </div>

            {/* Subtitle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان الفرعي
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل العنوان الفرعي..."
                dir="rtl"
              />
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصورة البارزة
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      اختر صورة
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm mt-2">أو اسحب وأفلت الصورة هنا</p>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المقتطف
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ملخص قصير للمقال..."
                dir="rtl"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المحتوى <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="ابدأ كتابة المقال..."
              />
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكلمات المفتاحية
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أضف كلمة مفتاحية واضغط Enter..."
                  dir="rtl"
                />
                <button
                  onClick={addKeyword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تحسين محركات البحث (SEO)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان SEO
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="عنوان محسّن لمحركات البحث..."
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoTitle.length} / 60 حرف (الموصى به: 50-60)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف SEO
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وصف محسّن لمحركات البحث..."
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoDescription.length} / 160 حرف (الموصى به: 150-160)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفئة <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId || ''}
                onChange={(e) => {
                  const newCategoryId = e.target.value;

                  setCategoryId(newCategoryId);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              >
                <option value="">اختر فئة...</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Article Type */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">نوع المقال</h3>
              
              <div className="space-y-3">
                {/* Featured Article */}
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <Star className={`w-5 h-5 ${isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700">خبر مميز</span>
                </label>

                {/* Breaking News */}
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <Zap className={`w-5 h-5 ${isBreaking ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700">خبر عاجل</span>
                </label>
              </div>
            </div>

            {/* AI Assistant */}
            <AIAssistant
              content={content}
              title={title}
              onApplySummary={setExcerpt}
              onApplyTitle={setTitle}
              onApplySubtitle={setSubtitle}
              onApplyKeywords={(keywords) => setKeywords(keywords)}
              onApplySEO={(seoData) => {
                if (seoData.title) setSeoTitle(seoData.title);
                if (seoData.description) setSeoDescription(seoData.description);
              }}
              onApplyEditorialElements={(elements) => {
                setTitle(elements.mainTitle);
                setSubtitle(elements.subtitle);
                setExcerpt(elements.summary);
                setKeywords(elements.keywords);
              }}
            />

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
              <button
                onClick={() => handleSubmit('published')}
                disabled={createArticle.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Eye className="w-5 h-5" />
                نشر الآن
              </button>
              <button
                onClick={() => handleSubmit('review')}
                disabled={createArticle.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                إرسال للمراجعة
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={createArticle.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                حفظ كمسودة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

