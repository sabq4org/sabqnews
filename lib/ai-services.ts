import { invokeLLM } from "./llm";

/**
 * خدمات الذكاء الاصطناعي للمحتوى الإعلامي
 */

/**
 * توليد ملخص تلقائي للمقال
 */
export async function generateSummary(content: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد ذكي متخصص في تلخيص المقالات الإعلامية باللغة العربية. قم بإنشاء ملخص موجز ودقيق للمقال يحتوي على النقاط الرئيسية فقط.",
        },
        {
          role: "user",
          content: `قم بتلخيص المقال التالي في 2-3 جمل:\n\n${content}`,
        },
      ],
    });

    const responseContent = response.choices[0]?.message?.content;
    return typeof responseContent === "string" ? responseContent : "";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("فشل في توليد الملخص");
  }
}

/**
 * اقتراح عناوين بديلة للمقال
 */
export async function suggestTitles(content: string, currentTitle: string): Promise<string[]> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد ذكي متخصص في كتابة عناوين جذابة للمقالات الإعلامية باللغة العربية. قم بإنشاء عناوين واضحة ومشوقة تجذب القارئ.",
        },
        {
          role: "user",
          content: `العنوان الحالي: ${currentTitle}\n\nالمحتوى:\n${content}\n\nاقترح 5 عناوين بديلة جذابة ومناسبة لهذا المقال. قدم العناوين فقط، كل عنوان في سطر منفصل.`,
        },
      ],
    });

    const responseContent = response.choices[0]?.message?.content;
    const titles = typeof responseContent === "string"
      ? responseContent.split("\n")
          .filter((t: string) => t.trim().length > 0)
          .map((t: string) => t.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").trim())
      : [];

    return titles || [];
  } catch (error) {
    console.error("Error suggesting titles:", error);
    throw new Error("فشل في اقتراح العناوين");
  }
}

/**
 * تحليل المشاعر في المقال
 */
export async function analyzeSentiment(
  content: string
): Promise<{ sentiment: "positive" | "negative" | "neutral"; score: number }> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت محلل مشاعر متخصص. قم بتحليل النبرة العامة للنص وتحديد ما إذا كانت إيجابية أو سلبية أو محايدة.",
        },
        {
          role: "user",
          content: `حلل المشاعر في النص التالي وحدد النبرة العامة:\n\n${content}\n\nقدم الإجابة بصيغة JSON فقط: {"sentiment": "positive|negative|neutral", "score": 0-100}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sentiment_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              sentiment: {
                type: "string",
                enum: ["positive", "negative", "neutral"],
                description: "النبرة العامة للنص",
              },
              score: {
                type: "integer",
                description: "درجة الثقة من 0 إلى 100",
              },
            },
            required: ["sentiment", "score"],
            additionalProperties: false,
          },
        },
      },
    });

    const responseContent = response.choices[0]?.message?.content;
    const result = JSON.parse(typeof responseContent === "string" ? responseContent : "{}");
    return {
      sentiment: result.sentiment || "neutral",
      score: result.score || 50,
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return { sentiment: "neutral", score: 50 };
  }
}

/**
 * اقتراح كلمات مفتاحية للمقال
 */
export async function suggestKeywords(content: string, title: string): Promise<string[]> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت خبير SEO متخصص في اقتراح الكلمات المفتاحية للمقالات باللغة العربية. اقترح كلمات مفتاحية ذات صلة ومحسّنة لمحركات البحث.",
        },
        {
          role: "user",
          content: `العنوان: ${title}\n\nالمحتوى:\n${content}\n\nاقترح 10 كلمات مفتاحية مناسبة لهذا المقال. قدم الكلمات فقط، كل كلمة في سطر منفصل.`,
        },
      ],
    });

    const responseContent = response.choices[0]?.message?.content;
    const keywords = typeof responseContent === "string"
      ? responseContent.split("\n")
          .filter((k: string) => k.trim().length > 0)
          .map((k: string) => k.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").trim())
      : [];

    return keywords || [];
  } catch (error) {
    console.error("Error suggesting keywords:", error);
    throw new Error("فشل في اقتراح الكلمات المفتاحية");
  }
}

/**
 * حساب درجة سهولة القراءة
 */
export async function calculateReadabilityScore(content: string): Promise<number> {
  try {
    // حساب بسيط بناءً على طول الجمل والكلمات
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = content.split(/\s+/).filter((w) => w.trim().length > 0);

    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;

    // صيغة بسيطة لحساب سهولة القراءة (0-100، حيث 100 هو الأسهل)
    let score = 100 - avgWordsPerSentence * 2 - avgCharsPerWord * 3;
    score = Math.max(0, Math.min(100, score));

    return Math.round(score);
  } catch (error) {
    console.error("Error calculating readability:", error);
    return 50;
  }
}

/**
 * اقتراحات تحسين المقال
 */
export async function generateSuggestions(articleContent: string, title: string): Promise<string[]> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت محرر محترف متخصص في تحسين المقالات الإعلامية. قدم اقتراحات عملية لتحسين جودة المقال.",
        },
        {
          role: "user",
          content: `العنوان: ${title}\n\nالمحتوى:\n${articleContent}\n\nقدم 5 اقتراحات لتحسين هذا المقال (من حيث الأسلوب، البنية، الوضوح، إلخ). قدم كل اقتراح في سطر منفصل.`,
        },
      ],
    });

    const responseContent = response.choices[0]?.message?.content;
    const suggestions = typeof responseContent === "string"
      ? responseContent.split("\n")
          .filter((s: string) => s.trim().length > 0)
          .map((s: string) => s.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").trim())
      : [];

    return suggestions || [];
  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw new Error("فشل في توليد الاقتراحات");
  }
}

/**
 * توليد وصف SEO تلقائي
 */
export async function generateSEODescription(articleContent: string, title: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت خبير SEO متخصص في كتابة أوصاف محسّنة لمحركات البحث باللغة العربية. اكتب وصفاً جذاباً ومختصراً (150-160 حرف).",
        },
        {
          role: "user",
          content: `العنوان: ${title}\n\nالمحتوى:\n${articleContent}\n\nاكتب وصف SEO مناسب لهذا المقال (150-160 حرف).`,
        },
      ],
    });

    const responseContent = response.choices[0]?.message?.content;
    return typeof responseContent === "string" ? responseContent.trim() : "";
  } catch (error) {
    console.error("Error generating SEO description:", error);
    throw new Error("فشل في توليد وصف SEO");
  }
}

/**
 * تحليل شامل للمقال باستخدام الذكاء الاصطناعي
 */
export async function analyzeArticle(content: string, title: string) {
  try {
    const [summary, titles, sentiment, keywords, readability, suggestions, seoDescription] =
      await Promise.all([
        generateSummary(content),
        suggestTitles(content, title),
        analyzeSentiment(content),
        suggestKeywords(content, title),
        calculateReadabilityScore(content),
        generateSuggestions(content, title),
        generateSEODescription(content, title),
      ]);

    return {
      summary,
      suggestedTitles: titles,
      sentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      keywords,
      readabilityScore: readability,
      suggestions,
      seoDescription,
    };
  } catch (error) {
    console.error("Error analyzing article:", error);
    throw new Error("فشل في تحليل المقال");
  }
}



/**
 * توليد جميع العناصر التحريرية دفعة واحدة
 * (العنوان الرئيسي، العنوان الفرعي، الملخص، الكلمات المفتاحية)
 */
export async function generateEditorialElements(content: string): Promise<{
  mainTitle: string;
  subtitle: string;
  summary: string;
  keywords: string[];
}> {
  try {
    const prompt = `أنت محرر ذكي متخصص في الصحافة العربية الحديثة، تعمل داخل نظام "سبق الذكية" لإدارة المحتوى الإخباري. 
يتم تزويدك بالنص الكامل لمقال أو خبر، ومطلوب منك توليد العناصر التحريرية التالية بدقة واحترافية:

1. **العنوان الرئيسي (Main Title)**:  
   - جذاب، مباشر، موجز (من 6 إلى 12 كلمة).  
   - يعكس جوهر النص ويشد القارئ فوراً.  
   - بأسلوب صحيفة سبق التحريري.

2. **العنوان الفرعي (Subtitle)**:  
   - يضيف عمقًا أو زاوية جديدة للعناوين.  
   - يتراوح بين جملة إلى جملتين.  
   - لا يعيد صياغة العنوان الرئيسي بل يكمله.

3. **الملخص (Summary)**:  
   - من 3 إلى 4 جمل قصيرة.  
   - يعرض أهم النقاط والمعلومات الجوهرية.  
   - بأسلوب صحفي عربي واضح ومهني.

4. **الكلمات المفتاحية (Keywords)**:  
   - من 6 إلى 10 كلمات رئيسية مستخلصة من النص.  
   - تمثل موضوعات الخبر والأسماء والأماكن المهمة.

📘 تنسيق الإخراج المطلوب (JSON فقط):
{
  "main_title": "العنوان الرئيسي هنا",
  "subtitle": "العنوان الفرعي هنا",
  "summary": "الملخص التحريري هنا...",
  "keywords": ["كلمة", "كلمة", "كلمة"]
}

✳️ تذكير:
- استخدم اللغة العربية الفصحى الحديثة بأسلوب صحيفة سبق.
- لا تُضف أي مقدمات أو شروحات خارج JSON.
- حافظ على التوازن بين المهنية والجاذبية.
- استند على فهمك الدلالي للنص وليس فقط الكلمات الظاهرة.

النص:
${content}
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "أنت محرر ذكي متخصص في الصحافة العربية. قم بتوليد العناصر التحريرية بصيغة JSON فقط بدون أي نص إضافي.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("لم يتم الحصول على استجابة");
    }

    const parsed = JSON.parse(responseContent);
    
    return {
      mainTitle: parsed.main_title || "",
      subtitle: parsed.subtitle || "",
      summary: parsed.summary || "",
      keywords: parsed.keywords || [],
    };
  } catch (error) {
    console.error("Error generating editorial elements:", error);
    throw new Error("فشل في توليد العناصر التحريرية");
  }
}

export const RELATED_RECS_PROMPT = `
أنت مساعد تحرير في صحيفة سعودية رقمية.
مهمّتك: اقتراح مقالات ذات صلة بالمادة الحالية.

المطلوب:
- ارجع حتى 6 توصيات بترتيب الصلة.
- لكل توصية: {title, url, reason, score من 0 إلى 1}.
- التزم بالمصادر الداخلية أولاً إن وجدت.
- لا تكرر الروابط.

الإخراج بصيغة JSON صارمة فقط.
`;

/**
 * توليد توصيات مقالات ذات صلة باستخدام الذكاء الاصطناعي
 */
export async function generateRelatedArticles(input: {
  slug?: string;
  categoryIds?: string[];
}): Promise<{ title: string; url: string; reason: string; score: number }[]> {
  try {
    const prompt = RELATED_RECS_PROMPT;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: RELATED_RECS_PROMPT,
        },
        {
          role: "user",
          content: `المقال الحالي: ${input.slug || ''}، الفئات: ${input.categoryIds?.join(', ') || ''}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("لم يتم الحصول على استجابة لتوصيات المقالات");
    }

    const parsed = JSON.parse(responseContent);
    // Validate that parsed is an array of objects with title and slug
    if (Array.isArray(parsed) && parsed.every(item => typeof item.title === 'string' && typeof item.url === 'string' && typeof item.reason === 'string' && typeof item.score === 'number')) {
      return parsed;
    } else {
      console.error("Invalid JSON format for recommendations:", responseContent);
      return [];
    }
  } catch (error) {
    console.error("Error generating related articles:", error);
    return [];
  }
}

