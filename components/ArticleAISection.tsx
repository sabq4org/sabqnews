import AISummary from '@/components/AISummary';
import RecommendationsSection from '@/components/RecommendationsSection';
import { generateSummary, generateRelatedArticles } from '@/lib/ai-services';
import { articles, categories } from '@/drizzle/schema';

interface ArticleAISectionProps {
  article: typeof articles.$inferSelect;
  categoryName: string;
}

export default async function ArticleAISection({
  article,
  categoryName,
}: ArticleAISectionProps) {
  const summary = await generateSummary(article.content as string);

  let aiRecommendations: { title: string; url: string; reason: string; score: number }[] = [];
  if (article.tags && Array.isArray(article.tags) && article.tags.length > 0) {
    aiRecommendations = await generateRelatedArticles(
      article.content as string,
      article.title,
      categoryName,
      article.tags as string[]
    );
  }

  const finalRecommendations = aiRecommendations.length > 0 ? aiRecommendations.map(rec => ({ ...rec, slug: rec.url })) : [];

  return (
    <>
      <AISummary summary={summary} />
      <RecommendationsSection articles={finalRecommendations} title="مقالات موصى بها لك" />
    </>
  );
}

