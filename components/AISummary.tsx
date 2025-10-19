'use client';

import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AISummaryProps {
  summary: string;
  isLoading?: boolean;
  onClose?: () => void;
}

export default function AISummary({ summary, isLoading = false, onClose }: AISummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!summary && !isLoading) return null;

  return (
    <div className="card bg-gradient-to-r from-ai-50 to-primary-50 dark:from-ai-900/20 dark:to-primary-900/20 border-l-4 border-ai-500 mb-6 overflow-hidden animate-slide-in-up">
      {/* رأس الملخص */}
      <div className="px-4 py-3 flex items-center justify-between bg-ai-100 dark:bg-ai-900/30 border-b border-ai-200 dark:border-ai-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-ai-500 text-white">
            <Sparkles size={16} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">ملخص بالذكاء الاصطناعي</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-ai-200 dark:hover:bg-ai-800 rounded-lg transition-colors"
            aria-label={isExpanded ? 'إغلاق الملخص' : 'فتح الملخص'}
          >
            {isExpanded ? (
              <ChevronUp size={18} className="text-ai-600 dark:text-ai-400" />
            ) : (
              <ChevronDown size={18} className="text-ai-600 dark:text-ai-400" />
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-ai-200 dark:hover:bg-ai-800 rounded-lg transition-colors"
              aria-label="إغلاق الملخص"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* محتوى الملخص */}
      {isExpanded && (
        <div className="px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-ai-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-ai-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-ai-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="mr-3 text-gray-600 dark:text-gray-400 text-sm">جاري إنشاء الملخص...</span>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* تذييل الملخص */}
      <div className="px-4 py-2 bg-ai-50 dark:bg-ai-900/10 border-t border-ai-200 dark:border-ai-800 text-xs text-gray-600 dark:text-gray-400">
        <p>💡 هذا الملخص تم إنشاؤه بواسطة الذكاء الاصطناعي. قد لا يعكس جميع التفاصيل الدقيقة للمقال الأصلي.</p>
      </div>
    </div>
  );
}

