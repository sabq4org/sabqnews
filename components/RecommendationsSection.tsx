'use client';

import { Sparkles } from 'lucide-react';
import NewsCard from './NewsCard';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  slug: string;
  category: string;
  publishedAt: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

interface RecommendationsSectionProps {
  articles: Article[];
  title?: string;
  isLoading?: boolean;
}

export default function RecommendationsSection({
  articles,
  title = 'مقترح لك',
  isLoading = false,
}: RecommendationsSectionProps) {
  if (!articles.length && !isLoading) return null;

  return (
    <section className="py-8 border-t border-gray-200 dark:border-gray-700">
      {/* العنوان */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-ai-100 dark:bg-ai-900 text-ai-600 dark:text-ai-400">
          <Sparkles size={16} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>

      {/* الشبكة */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-80 animate-pulse bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt}
              image={article.featuredImage}
              slug={article.slug}
              category={article.category}
              date={article.publishedAt}
              isFeatured={article.isFeatured}
              isBreaking={article.isBreaking}
              variant="default"
            />
          ))}
        </div>
      )}
    </section>
  );
}

