import { GoogleGenAI, Modality, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Parses a raw menu text string into a structured list of dishes using Gemini 2.5 Flash.
 */
export const parseMenuText = async (text: string): Promise<{ name: string; description: string }[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a culinary data assistant. Extract a list of dishes from the following menu text. 
      For each dish, provide the 'name' and a brief, visual 'description' suitable for an image generation prompt.
      Ignore headings like "Appetizers" or prices.
      
      Menu Text:
      ${text}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['name', 'description'],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error parsing menu:", error);
    throw error;
  }
};

/**
 * Generates an image for a specific dish using Imagen 4.
 */
export const generateDishImage = async (dishName: string, dishDescription: string, stylePrompt: string): Promise<string> => {
  try {
    const fullPrompt = `A delicious, high-end photo of ${dishName}. ${dishDescription}. ${stylePrompt}`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3', // Good for food photography
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) {
      throw new Error("No image generated");
    }
    return `data:image/jpeg;base64,${imageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Edits an existing image using Gemini 2.5 Flash Image (Nano Banana).
 * The model takes the original image and a text instruction to produce a new image.
 */
export const editDishImage = async (base64Image: string, instruction: string): Promise<string> => {
  try {
    // Remove the data URL prefix to get just the base64 bytes
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: instruction,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image returned from edit operation");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};
