
export enum AppPhase {
  AVATAR_CREATION = 'AVATAR_CREATION',
  SOLAR_SYSTEM = 'SOLAR_SYSTEM',
  OUTRO = 'OUTRO'
}

export interface AvatarConfig {
  name: string;
  gender: 'nen' | 'nena';
  height: string;
  hairColor: string;
  hairType: string;
  imageUrl?: string;
  outroImageUrl?: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface PlanetData {
  id: string;
  name: string;
  color: string;
  size: number; // Relative size
  distance: number; // Relative distance from sun
  speed: number; // Rotation speed
  textureType: 'rocky' | 'gaseous' | 'star';
  textureUrl: string; // URL for the surface texture
  ringColor?: string;
  ringTextureUrl?: string; // New field for realistic rings
  description: string;
  youtubeId: string; // Placeholder for video ID
  
  // New engaging texts
  videoText: string;
  quizText: string;

  quiz: Question[];
  externalQuizUrl?: string; // New field for NotebookLM or external links
  moons: number;
}

export interface QuizResult {
  planetId: string;
  correct: boolean;
}