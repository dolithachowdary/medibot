import { GoogleGenAI } from "@google/genai";

/**
 * Utility to generate embeddings using Google Gemini.
 * Uses text-embedding-004 which produces 768-dimensional vectors.
 */
export async function generateEmbedding(text) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing for embeddings generation.");
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "models/gemini-embedding-001",
                content: { parts: [{ text }] }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gemini API Error");
        }

        const data = await response.json();
        // embedding-001 returns values in values property
        return data.embedding.values;
    } catch (error) {
        console.error("❌ Embedding Generation Error:", error);
        throw error;
    }
}
