

import { PlanetData } from './types';

// High resolution moon texture
export const MOON_TEXTURE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1024px-FullMoon2010.jpg';

export const PLANETS: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sol',
    color: '#FDB813',
    size: 4.5, 
    distance: 0,
    speed: 0.002,
    textureType: 'star',
    // Higher quality Sun texture
    textureUrl: 'https://www.solarsystemscope.com/textures/download/8k_sun.jpg',
    description: 'La estrella en el centro de nuestro sistema solar.',
    youtubeId: '1YcXany7XDs',
    moons: 0,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/01e6f3bb-ee3b-4451-8573-9c90164ff25b?artifactId=31e995fd-18cd-4605-b743-d9e9b3b70289',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario del Sol en NotebookLM?',
        options: ['Sí, misión cumplida', 'No, aún no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'mercury',
    name: 'Mercurio',
    color: '#A5A5A5',
    size: 0.8,
    distance: 8,
    speed: 0.04,
    textureType: 'rocky',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    description: 'El planeta más pequeño y cercano al Sol.',
    youtubeId: 'Vqazv5WUFBs',
    moons: 0,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/d973e17c-92e3-4631-8c46-14389b064433?artifactId=7ed66502-d6cf-4e96-8c33-7c2bc126c09e',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario de Mercurio en NotebookLM?',
        options: ['Sí, completado', 'Todavía no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#E3BB76',
    size: 1.1,
    distance: 12,
    speed: 0.015,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
    description: 'El planeta más caluroso del sistema solar.',
    youtubeId: 'y7QpSLd3DCQ',
    moons: 0,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/c684f72d-eb49-4d65-b0a0-c4c7aef548ea?artifactId=166ea394-172d-41b8-ab14-987ee4af93f6',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario de Venus en NotebookLM?',
        options: ['Sí, misión completada', 'Aún no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'earth',
    name: 'Tierra',
    color: '#22A6B3',
    size: 1.15,
    distance: 17,
    speed: 0.01,
    textureType: 'rocky',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    description: 'Nuestro hogar, el planeta azul.',
    youtubeId: 'ASWtl4HdIJQ',
    moons: 1,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/09800d3e-4afd-4134-be90-1fb41c163736?artifactId=f69eedf9-d1bf-4404-a0f6-3c39eaf08b33',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario de la Tierra en NotebookLM?',
        options: ['Sí, misión completada', 'Todavía no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'mars',
    name: 'Marte',
    color: '#EB4D4B',
    size: 0.9,
    distance: 22,
    speed: 0.008,
    textureType: 'rocky',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    description: 'El planeta rojo.',
    youtubeId: 'sezt04Hq5RA',
    moons: 2,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/64a58a7e-2781-43b9-9a64-fa504ea165f3?artifactId=f3fd3c22-7b97-435d-a0e6-7af1630641d2',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario de Marte en NotebookLM?',
        options: ['Sí, misión completada', 'Todavía no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    color: '#E1B12C',
    size: 3.5,
    distance: 32,
    speed: 0.02,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
    description: 'El planeta más grande del sistema solar.',
    youtubeId: 'jFV4dB5AplU',
    moons: 4, 
    externalQuizUrl: 'https://notebooklm.google.com/notebook/ca3f78e2-9537-40d3-88c1-62d94b289049?artifactId=53e6f189-94cc-4aca-aa6a-45e9296ca1d3',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario de Júpiter en NotebookLM?',
        options: ['Sí, misión completada', 'Todavía no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturno',
    color: '#F3D250',
    size: 3,
    distance: 42,
    speed: 0.018,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    ringColor: '#F3D250',
    description: 'Famoso por sus espectaculares anillos.',
    youtubeId: 'epZdZaEQhS0',
    moons: 5,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/9423026c-d637-4ee8-9ce2-8743ab6f8f63?artifactId=b94f4900-aaa0-4b8b-911d-db89961d82ce',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario de Saturno en NotebookLM?',
        options: ['Sí, misión completada', 'Todavía no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Urano',
    color: '#74B9FF',
    size: 2.2,
    distance: 50,
    speed: 0.015,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    ringColor: '#74B9FF',
    description: 'El gigante de hielo que gira de lado.',
    youtubeId: '6QvQ3Nq01aI', // Placeholder
    moons: 3,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/3ff940e7-c428-41ee-b499-cd291cd398e5?artifactId=8cb0256e-0522-4d7d-bdc6-109ce082db5e',
    quiz: [
      {
        id: 1,
        text: '¿Has completado el cuestionario de Urano en NotebookLM?',
        options: ['Sí, misión completada', 'Todavía no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptuno',
    color: '#0984E3',
    size: 2.1,
    distance: 58,
    speed: 0.012,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
    description: 'El planeta más ventoso y lejano.',
    youtubeId: 'NStn75gIhwg', // Placeholder
    moons: 3,
    quiz: [
      {
        id: 1,
        text: '¿Cuál es el color de Neptuno?',
        options: ['Azul intenso', 'Verde', 'Amarillo'],
        correctAnswerIndex: 0
      }
    ]
  }
];