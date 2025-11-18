
import { GoogleGenAI } from "@google/genai";
import type { NewsArticle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseNewsText = (text: string, groundingChunks: any[]): NewsArticle[] => {
  const articles: NewsArticle[] = [];
  const articleBlocks = text.split('---').filter(block => block.trim() !== '');

  articleBlocks.forEach((block, index) => {
    const titleMatch = block.match(/タイトル:\s*(.*)/);
    const summaryMatch = block.match(/要約:\s*(.*)/);
    const tagsMatch = block.match(/タグ:\s*(.*)/);
    
    const source = groundingChunks[index]?.web;

    if (titleMatch && summaryMatch && tagsMatch) {
      articles.push({
        title: titleMatch[1].trim(),
        summary: summaryMatch[1].trim(),
        tags: tagsMatch[1].split(',').map(tag => tag.trim()).filter(t => t),
        url: source?.uri || '#',
        sourceTitle: source?.title || '不明なソース',
      });
    }
  });

  return articles;
};

export const fetchNews = async (query: string): Promise<NewsArticle[]> => {
  try {
    const prompt = `「${query}」に関する最新のニュースを3件見つけて、以下の形式で厳密に出力してください。各ニュースは「---」で区切ってください。

タイトル: [ここにニュースのタイトル]
要約: [ここにニュースの短い要約]
タグ: [タグ1], [タグ2], [タグ3]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const rawText = response.text;
    
    if (!rawText) {
      console.warn("Gemini API returned an empty text response.");
      return [];
    }

    const parsedArticles = parseNewsText(rawText, groundingChunks);
    
    if (parsedArticles.length === 0 && groundingChunks.length > 0) {
      // Fallback if parsing fails but we have sources
      return groundingChunks.map(chunk => ({
        title: chunk.web?.title || 'タイトル不明',
        summary: '要約の生成に失敗しました。ソースをご確認ください。',
        tags: [],
        url: chunk.web?.uri || '#',
        sourceTitle: chunk.web?.title || '不明なソース'
      }));
    }

    return parsedArticles;

  } catch (error) {
    console.error("Error fetching news from Gemini API:", error);
    throw new Error("Failed to fetch news.");
  }
};
