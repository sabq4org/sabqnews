'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  category: string;
  date: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  variant?: 'default' | 'large' | 'compact';
  onAISummaryClick?: () => void;
}

export default function NewsCard({
  id,
  title,
  excerpt,
  image,
  slug,
  category,
  date,
  isFeatured = false,
  isBreaking = false,
  variant = 'default',
  onAISummaryClick,
}: NewsCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardClasses = {
    default: 'card overflow-hidden hover:shadow-lg transition-all duration-300',
    large: 'card overflow-hidden hover:shadow-xl transition-all duration-300 lg:col-span-2',
    compact: 'card overflow-hidden hover:shadow-md transition-all duration-300',
  };

  const imageHeight = {
    default: 'h-48',
    large: 'h-72',
    compact: 'h-32',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={cardClasses[variant]}>
      {/* الصورة */}
      <div className={`relative ${imageHeight[variant]} bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-transform duration-300 ${
              imageLoaded ? 'scale-100' : 'scale-95'
            } hover:scale-105`}
            onLoadingComplete={() => setImageLoaded(true)}
            priority={variant === 'large'}
          />
        )}

        {/* شارات الحالة */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isBreaking && (
            <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
              <Zap size={14} />
              عاجل
            </div>
          )}
          {isFeatured && (
            <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ مميز
            </div>
          )}
        </div>

        {/* تصنيف */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-4">
        {/* العنوان */}
        <Link href={`/articles/${slug}`}>
          <h3 className={`font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 ${
            variant === 'large' ? 'text-xl mb-2' : 'text-base mb-1'
          }`}>
            {title}
          </h3>
        </Link>

        {/* الملخص */}
        {variant !== 'compact' && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}

        {/* البيانات الوصفية والأزرار */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <time>{formatDate(date)}</time>
          </div>

          {/* زر ملخص AI */}
          {onAISummaryClick && (
            <button
              onClick={onAISummaryClick}
              className="flex items-center gap-1 text-ai-600 dark:text-ai-400 hover:text-ai-700 dark:hover:text-ai-300 transition-colors text-xs font-medium group"
              title="عرض ملخص بالذكاء الاصطناعي"
            >
              <Sparkles size={14} className="group-hover:animate-spin" />
              <span className="hidden sm:inline">ملخص AI</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

