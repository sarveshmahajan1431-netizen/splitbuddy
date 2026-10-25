import { GoogleGenAI, Type } from "@google/genai";
import type { User, CompatibilityResult } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this project, we'll alert the developer.
    alert("API_KEY environment variable is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateAnonymousAvatars = async (): Promise<string[]> => {
  const prompt = "Generate 3 diverse, minimalist, and friendly placeholder avatars in a modern, flat illustration style. They should be suitable for a user profile picture, using a pleasant color palette. Avoid text, and specific facial features, aiming for an abstract and universally appealing look.";

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 3,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    throw new Error("Failed to generate avatars with Gemini API.");
  }
};

/**
 * Analyzes the compatibility between two users using the Gemini API.
 * @param user1 The first user.
 * @param user2 The second user.
 * @returns A compatibility analysis object.
 */
export const getCompatibility = async (user1: User, user2: User): Promise<CompatibilityResult> => {
  // Helper to extract relevant user data for analysis, omitting sensitive/irrelevant fields.
  const getUserProfileForAnalysis = (user: User) => {
    const { id, name, imageUrl, email, password, phone, ...profile } = user;
    return profile;
  };

  const user1Profile = getUserProfileForAnalysis(user1);
  const user2Profile = getUserProfileForAnalysis(user2);

  const prompt = `
      Analyze the roommate compatibility between these two people based on their JSON profiles.
      User 1: ${JSON.stringify(user1Profile)}
      User 2: ${JSON.stringify(user2Profile)}

      Based on their bio, budget, and lifestyle preferences (smoking, drinking, food, social habits, cleanliness), provide a detailed analysis.
      The output must be a valid JSON object matching the provided schema.
  `;

  const responseSchema = {
      type: Type.OBJECT,
      properties: {
          score: {
              type: Type.INTEGER,
              description: 'A compatibility score from 0 to 100, where 100 is a perfect match.'
          },
          summary: {
              type: Type.STRING,
              description: 'A brief 1-2 sentence summary of their compatibility.'
          },
          pros: {
              type: Type.ARRAY,
              items: {
                  type: Type.STRING,
                  description: 'A specific reason why they might be a good match.'
              },
              description: 'A list of 3-4 potential positive aspects of them living together.'
          },
          cons: {
              type: Type.ARRAY,
              items: {
                  type: Type.STRING,
                  description: 'A specific potential conflict point or area of difference.'
              },
              description: 'A list of 2-3 potential challenges or things to consider.'
          }
      },
      required: ['score', 'summary', 'pros', 'cons']
  };

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
          },
      });

      const jsonText = response.text.trim();
      const result: CompatibilityResult = JSON.parse(jsonText);

      // Basic validation
      if (typeof result.score !== 'number' || !Array.isArray(result.pros) || !Array.isArray(result.cons) || typeof result.summary !== 'string') {
          throw new Error('Invalid JSON structure from Gemini API.');
      }

      return result;
  } catch (error) {
      console.error("Error calling Gemini API for compatibility analysis:", error);
      throw new Error("Failed to get compatibility analysis from Gemini API.");
  }
};
