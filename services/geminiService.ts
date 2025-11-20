import { GoogleGenAI, Modality } from "@google/genai";
import { AvatarConfig } from '../types';

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateAvatarImage = async (config: AvatarConfig): Promise<string | null> => {
  try {
    const prompt = `A cute Studio Ghibli style illustration of a 9 year old ${config.gender} astronaut named ${config.name}. 
    The child has ${config.hairColor} hair that is ${config.hairType}. 
    They are wearing a white astronaut suit but NO helmet. Their head is visible. 
    Happy, adventurous expression. Clean white or simple pastel background. High quality anime style art.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE]
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      const base64ImageBytes = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    
    return null;
  } catch (error) {
    console.error("Error generating avatar:", error);
    throw error;
  }
};

export const generateOutroImage = async (config: AvatarConfig): Promise<string | null> => {
  try {
    const prompt = `A cute Studio Ghibli style illustration of a 9 year old ${config.gender} astronaut named ${config.name} 
    (same character: ${config.hairColor}, ${config.hairType} hair, astronaut suit without helmet).
    The child is standing in front of a school gate. There is a sign on the gate that says "COLEGIO MAX AUB".
    The child is surrounded by other happy diverse children in normal clothes.
    The astronaut child is waving goodbye. Warm, sunset lighting, nostalgic but happy atmosphere.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE]
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      const base64ImageBytes = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    
    return null;
  } catch (error) {
    console.error("Error generating outro:", error);
    throw error;
  }
};
