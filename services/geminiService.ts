
import { GoogleGenAI, Modality } from "@google/genai";
import { AvatarConfig } from '../types';

// Safely access process.env to avoid ReferenceError in some browser environments
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

const ai = new GoogleGenAI({ apiKey });

// Translation maps to convert Catalan UI values to English for the Prompt
const TRANSLATIONS: Record<string, string> = {
  'nen': 'boy',
  'nena': 'girl',
  'ros': 'blonde',
  'castany': 'brown',
  'negre': 'black',
  'pèl-roig': 'red',
  'blau fantasia': 'blue fantasy',
  'rosa fantasia': 'pink fantasy',
  'llis': 'straight',
  'arrissat': 'curly',
  'ondulat': 'wavy',
  'curt': 'short',
  'cues': 'pigtails',
};

const translate = (text: string): string => {
  return TRANSLATIONS[text.toLowerCase()] || text;
};

export const generateAvatarImage = async (config: AvatarConfig): Promise<string | null> => {
  try {
    const genderEn = translate(config.gender);
    const hairColorEn = translate(config.hairColor);
    const hairTypeEn = translate(config.hairType);

    const prompt = `A cute Studio Ghibli style illustration of a 9 year old ${genderEn} astronaut named ${config.name}. 
    The child has ${hairColorEn} hair that is ${hairTypeEn}. 
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
    const genderEn = translate(config.gender);
    const hairColorEn = translate(config.hairColor);
    const hairTypeEn = translate(config.hairType);

    const prompt = `A cute Studio Ghibli style illustration of a 9 year old ${genderEn} astronaut named ${config.name} 
    (same character: ${hairColorEn}, ${hairTypeEn} hair, astronaut suit without helmet).
    The child is standing in front of a school gate. There is a sign on the gate that says "COL·LEGI MAX AUB".
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