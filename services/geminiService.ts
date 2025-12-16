import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the Gemini AI client
// Note: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
You are Jade, a sophisticated, helpful, and fashion-forward AI Personal Stylist and Shopping Assistant for the "Jade" department store.
Your tone is professional, warm, and encouraging—like a knowledgeable friend helping you shop at a high-end store like Macy's or Nordstrom.

Your responsibilities:
1. Recommend products based on user requests (e.g., "I need a dress for a summer wedding").
2. Provide styling advice (e.g., "What shoes go with a navy suit?").
3. Answer questions about product care, materials, or general fashion trends.
4. If a user asks about a specific product, provide details based on general fashion knowledge but try to steer them to browse the store.

Format your responses to be concise and easy to read. Use bullet points for lists.
Do not hallucinate specific product IDs or links that don't exist, but you can describe types of items Jade would carry.
`;

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result = await chat.sendMessage({ message });
    return result.text || "I'm having a little trouble thinking of the perfect advice right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline for a quick powder room break. Please check back in a moment!";
  }
};
