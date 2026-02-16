import { GoogleGenAI } from "@google/genai";
import { Trade } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMarketPerformance = async (
  recentTrades: Trade[],
  currentSpread: number
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key missing. Cannot generate AI analysis.";
  }

  const tradeSummary = recentTrades.slice(0, 5).map(t => 
    `- Buy ${t.exchangeBuy} @ $${t.priceBuy.toFixed(2)}, Sell ${t.exchangeSell} @ $${t.priceSell.toFixed(2)} (Profit: $${t.profit.toFixed(2)})`
  ).join('\n');

  const prompt = `
    You are the central intelligence for an Autonomous Agent Swarm (ASI/FET) performing arbitrage.
    
    Current Market Context:
    - Token: FET (Artificial Superintelligence Alliance)
    - Current Price Spread: $${currentSpread.toFixed(3)}
    
    Recent Swarm Activity:
    ${tradeSummary}
    
    Task:
    Provide a brief, high-tech, futuristic tactical report (max 2 sentences) on the swarm's performance and the current market opportunity. 
    Use terminology like "alpha generation", "latency arbitrage", "spread capture", and "autonomous execution".
    Be encouraging but analytical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Analysis complete. Optimization recommended.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System Link Unstable. AI Analysis unavailable.";
  }
};