
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
 * Uses Gemini 2.5 Flash to first expand and refine the prompt for better results.
 */
export const generateDishImage = async (
  dishName: string, 
  dishDescription: string, 
  stylePrompt: string,
  aspectRatio: string = '4:3'
): Promise<string> => {
  try {
    // Step 1: Expand the prompt using Gemini 2.5 Flash
    // This allows for dynamic blending of the dish details with the requested aesthetic style
    const promptRefinementResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert food photography director. Create a highly detailed image generation prompt for Google Imagen based on these inputs:
      
      Dish Name: ${dishName}
      Dish Description: ${dishDescription}
      Aesthetic Style Guidelines: ${stylePrompt}
      AspectRatio: ${aspectRatio}
      
      Instructions:
      1. Create a cohesive visual description that seamlessly integrates the dish details with the aesthetic style.
      2. Describe the lighting, plating, camera angle, depth of field, and background textures specifically for this dish and style.
      3. Ensure the food sounds delicious and the photography sounds professional.
      4. Output ONLY the raw prompt text to be sent to the image generator. Do not include "Prompt:" or markdown.`,
    });

    const fullPrompt = promptRefinementResponse.text?.trim() || `A delicious, high-end photo of ${dishName}. ${dishDescription}. ${stylePrompt}`;
    
    console.log(`Generating image for "${dishName}" with prompt:`, fullPrompt);

    // Step 2: Generate the image
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio, 
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
