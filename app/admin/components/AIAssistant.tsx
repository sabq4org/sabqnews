'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import {
  Sparkles,
  FileText,
  Hash,
  Heart,
  Lightbulb,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';

interface AIAssistantProps {
  title: string;
  content: string;
  onApplySummary?: (summary: string) => void;
  onApplyTitle?: (title: string) => void;
  onApplyKeywords?: (keywords: string[]) => void;
  onApplySEO?: (description: string) => void;
}

export default function AIAssistant({
  title,
  content,
  onApplySummary,
  onApplyTitle,
  onApplyKeywords,
  onApplySEO,
}: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'titles' | 'keywords' | 'sentiment' | 'seo' | 'full'>('summary');

  // Mutations
  const generateSummary = trpc.ai.generateSummary.useMutation();
  const suggestTitles = trpc.ai.suggestTitles.useMutation();
  const suggestKeywords = trpc.ai.suggestKeywords.useMutation();
  const analyzeSentiment = trpc.ai.analyzeSentiment.useMutation();
  const generateSEO = trpc.ai.generateSEODescription.useMutation();
  const analyzeArticle = trpc.ai.analyzeArticle.useMutation();

  const handleGenerateSummary = async () => {
    if (!content || content.length < 100) {
      alert('المحتوى قصير جداً للتلخيص');
      return;
    }

    try {
      const result = await generateSummary.mutateAsync({ content });
      if (onApplySummary) {
        onApplySummary(result.summary);
      }
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleSuggestTitles = async () => {
    if (!content || content.length < 100) {
      alert('المحتوى قصير جداً');
      return;
    }

    try {
      await suggestTitles.mutateAsync({ content, currentTitle: title });
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleSuggestKeywords = async () => {
    if (!content || content.length < 100) {
      alert('المحتوى قصير جداً');
      return;
    }

    try {
      const result = await suggestKeywords.mutateAsync({ content, title });
      if (onApplyKeywords) {
        onApplyKeywords(result.keywords);
      }
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleAnalyzeSentiment = async () => {
    if (!content || content.length < 50) {
      alert('المحتوى قصير جداً');
      return;
    }

    try {
      await analyzeSentiment.mutateAsync({ content });
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleGenerateSEO = async () => {
    if (!content || content.length < 100) {
      alert('المحتوى قصير جداً');
      return;
    }

    try {
      const result = await generateSEO.mutateAsync({ content, title });
      if (onApplySEO) {
        onApplySEO(result.description);
      }
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleFullAnalysis = async () => {
    if (!content || content.length < 100 || !title) {
      alert('يرجى إدخال العنوان والمحتوى أولاً');
      return;
    }

    try {
      await analyzeArticle.mutateAsync({ content, title });
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'إيجابي';
      case 'negative':
        return 'سلبي';
      default:
        return 'محايد';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">مساعد الذكاء الاصطناعي</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 border-t border-purple-200 bg-white">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeTab === 'summary'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              التلخيص
            </button>
            <button
              onClick={() => setActiveTab('titles')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeTab === 'titles'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              العناوين
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeTab === 'keywords'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Hash className="w-4 h-4" />
              الكلمات المفتاحية
            </button>
            <button
              onClick={() => setActiveTab('sentiment')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeTab === 'sentiment'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              المشاعر
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeTab === 'seo'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              SEO
            </button>
            <button
              onClick={() => setActiveTab('full')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeTab === 'full'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              تحليل شامل
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-3">
                <button
                  onClick={handleGenerateSummary}
                  disabled={generateSummary.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {generateSummary.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري التلخيص...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      توليد ملخص
                    </>
                  )}
                </button>

                {generateSummary.data && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed" dir="rtl">
                      {generateSummary.data.summary}
                    </p>
                    {onApplySummary && (
                      <button
                        onClick={() => onApplySummary(generateSummary.data!.summary)}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                      >
                        تطبيق كمقتطف
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Titles Tab */}
            {activeTab === 'titles' && (
              <div className="space-y-3">
                <button
                  onClick={handleSuggestTitles}
                  disabled={suggestTitles.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {suggestTitles.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الاقتراح...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      اقتراح عناوين
                    </>
                  )}
                </button>

                {suggestTitles.data && (
                  <div className="space-y-2">
                    {suggestTitles.data.titles.map((suggestedTitle, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer group"
                        onClick={() => onApplyTitle && onApplyTitle(suggestedTitle)}
                      >
                        <p className="text-sm text-gray-700" dir="rtl">
                          {suggestedTitle}
                        </p>
                        {onApplyTitle && (
                          <span className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            انقر للتطبيق
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
              <div className="space-y-3">
                <button
                  onClick={handleSuggestKeywords}
                  disabled={suggestKeywords.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {suggestKeywords.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الاستخراج...
                    </>
                  ) : (
                    <>
                      <Hash className="w-4 h-4" />
                      استخراج الكلمات المفتاحية
                    </>
                  )}
                </button>

                {suggestKeywords.data && (
                  <div className="flex flex-wrap gap-2">
                    {suggestKeywords.data.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sentiment Tab */}
            {activeTab === 'sentiment' && (
              <div className="space-y-3">
                <button
                  onClick={handleAnalyzeSentiment}
                  disabled={analyzeSentiment.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {analyzeSentiment.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      تحليل المشاعر
                    </>
                  )}
                </button>

                {analyzeSentiment.data && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">النبرة العامة:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                          analyzeSentiment.data.sentiment
                        )}`}
                      >
                        {getSentimentLabel(analyzeSentiment.data.sentiment)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">درجة الثقة:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analyzeSentiment.data.score}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-3">
                <button
                  onClick={handleGenerateSEO}
                  disabled={generateSEO.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {generateSEO.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      توليد وصف SEO
                    </>
                  )}
                </button>

                {generateSEO.data && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed" dir="rtl">
                      {generateSEO.data.description}
                    </p>
                    {onApplySEO && (
                      <button
                        onClick={() => onApplySEO(generateSEO.data!.description)}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                      >
                        تطبيق كوصف SEO
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Full Analysis Tab */}
            {activeTab === 'full' && (
              <div className="space-y-3">
                <button
                  onClick={handleFullAnalysis}
                  disabled={analyzeArticle.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {analyzeArticle.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري التحليل الشامل...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4" />
                      تحليل شامل
                    </>
                  )}
                </button>

                {analyzeArticle.data && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">الملخص:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded" dir="rtl">
                        {analyzeArticle.data.summary}
                      </p>
                    </div>

                    {/* Sentiment */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">المشاعر:</h4>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${getSentimentColor(
                          analyzeArticle.data.sentiment
                        )}`}
                      >
                        {getSentimentLabel(analyzeArticle.data.sentiment)} (
                        {analyzeArticle.data.sentimentScore}%)
                      </span>
                    </div>

                    {/* Readability */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">سهولة القراءة:</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${analyzeArticle.data.readabilityScore}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {analyzeArticle.data.readabilityScore}%
                        </span>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">الكلمات المفتاحية:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analyzeArticle.data.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    {analyzeArticle.data.suggestions && analyzeArticle.data.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">اقتراحات التحسين:</h4>
                        <ul className="space-y-1">
                          {analyzeArticle.data.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-purple-600 mt-1">•</span>
                              <span dir="rtl">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

