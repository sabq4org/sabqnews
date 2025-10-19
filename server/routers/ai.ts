import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import {
  generateSummary,
  suggestTitles,
  analyzeSentiment,
  suggestKeywords,
  calculateReadabilityScore,
  generateSuggestions,
  generateSEODescription,
  analyzeArticle,
} from '@/lib/ai-services';

export const aiRouter = router({
  /**
   * توليد ملخص تلقائي للمقال
   */
  generateSummary: protectedProcedure
    .input(z.object({ content: z.string().min(100) }))
    .mutation(async ({ input }) => {
      const summary = await generateSummary(input.content);
      return { summary };
    }),

  /**
   * اقتراح عناوين بديلة
   */
  suggestTitles: protectedProcedure
    .input(
      z.object({
        content: z.string().min(100),
        currentTitle: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const titles = await suggestTitles(input.content, input.currentTitle);
      return { titles };
    }),

  /**
   * تحليل المشاعر
   */
  analyzeSentiment: protectedProcedure
    .input(z.object({ content: z.string().min(50) }))
    .mutation(async ({ input }) => {
      const result = await analyzeSentiment(input.content);
      return result;
    }),

  /**
   * اقتراح كلمات مفتاحية
   */
  suggestKeywords: protectedProcedure
    .input(
      z.object({
        content: z.string().min(100),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const keywords = await suggestKeywords(input.content, input.title);
      return { keywords };
    }),

  /**
   * حساب درجة سهولة القراءة
   */
  calculateReadability: protectedProcedure
    .input(z.object({ content: z.string().min(100) }))
    .mutation(async ({ input }) => {
      const score = await calculateReadabilityScore(input.content);
      return { score };
    }),

  /**
   * توليد اقتراحات لتحسين المقال
   */
  generateSuggestions: protectedProcedure
    .input(
      z.object({
        content: z.string().min(100),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const suggestions = await generateSuggestions(input.content, input.title);
      return { suggestions };
    }),

  /**
   * توليد وصف SEO
   */
  generateSEODescription: protectedProcedure
    .input(
      z.object({
        content: z.string().min(100),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const description = await generateSEODescription(input.content, input.title);
      return { description };
    }),

  /**
   * تحليل شامل للمقال
   */
  analyzeArticle: protectedProcedure
    .input(
      z.object({
        content: z.string().min(100),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const analysis = await analyzeArticle(input.content, input.title);
      return analysis;
    }),
});

