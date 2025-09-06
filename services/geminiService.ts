
import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, initialize GoogleGenAI directly with `process.env.API_KEY`.
// It is assumed to be pre-configured and accessible in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFocusTip = async (): Promise<string> => {
    // FIX: Per coding guidelines, removed check for API key. The API call should be attempted directly.
    // The try/catch block will handle any potential errors, such as a missing API key.
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a single, short, encouraging sentence for someone trying to stay focused and reduce screen time. Be positive and concise, like a fortune cookie message.',
        });

        if (response && response.text) {
            return response.text.trim();
        } else {
            throw new Error("Empty response from API");
        }
    } catch (error) {
        console.error("Error generating focus tip:", error);
        // Provide a helpful fallback message
        return "Every moment of focus is a victory. You're building a stronger mind.";
    }
};
