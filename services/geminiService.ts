import { GoogleGenAI } from "@google/genai";
import { GenerationRequest } from "../types";
import { MODEL_GENERATION, MODEL_EDITING, STYLE_PROMPTS } from "../constants";

// Helper to strip data:image/png;base64, prefix if present
const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.replace(/^data:image\/\w+;base64,/, "");
};

const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : 'image/png';
};

export const generateFoodPhoto = async (request: GenerationRequest): Promise<string> => {
  // Always create a new instance to pick up the latest API key from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const styleModifier = STYLE_PROMPTS[request.style];
  const fullPrompt = `Professional food photography of ${request.dishDescription}. Style: ${styleModifier}. High resolution, hyper-realistic, michelin star presentation.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_GENERATION,
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          imageSize: request.resolution,
          aspectRatio: "1:1", // Square for versatility
        },
      },
    });

    // Extract image from response
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in the response.");
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
};

export const editFoodPhoto = async (
  originalImageUrl: string, 
  editInstruction: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = cleanBase64(originalImageUrl);
  const mimeType = getMimeType(originalImageUrl);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_EDITING, // Gemini 2.5 Flash Image
      contents: {
        parts: [
          {
            text: editInstruction,
          },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ],
      },
      // Nano banana series does not support imageConfig for size/aspect ratio in the same way as Pro
    });

    for (const candidate of response.candidates || []) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }

    throw new Error("No edited image generated.");
  } catch (error) {
    console.error("Editing error:", error);
    throw error;
  }
};
