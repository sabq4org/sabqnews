/**
 * خدمة الذكاء الاصطناعي باستخدام OpenAI API
 */

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMOptions {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

export async function invokeLLM(options: LLMOptions): Promise<any> {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL || "https://api.openai.com/v1";
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("API key not configured");
  }

  const response = await fetch(`${apiUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: options.messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.statusText}`);
  }

  return await response.json();
}

