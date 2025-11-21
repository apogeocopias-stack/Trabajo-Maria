
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
    textureUrl: 'https://www.solarsystemscope.com/textures/download/8k_sun.jpg',
    description: 'L\'estrella al centre del nostre sistema solar.',
    youtubeId: '1YcXany7XDs',
    videoText: 'Atenció! Els filtres solars estan llestos. Vols veure el foc de prop?',
    quizText: 'Suportaràs la calor d\'aquestes preguntes?',
    moons: 0,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/01e6f3bb-ee3b-4451-8573-9c90164ff25b?artifactId=31e995fd-18cd-4605-b743-d9e9b3b70289',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari del Sol a NotebookLM?',
        options: ['Sí, missió complerta', 'No, encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'mercury',
    name: 'Mercuri',
    color: '#9E9E9E', // Greyer
    size: 0.8,
    distance: 8,
    speed: 0.04,
    textureType: 'rocky',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    description: 'El planeta més petit i proper al Sol.',
    youtubeId: 'Vqazv5WUFBs',
    videoText: 'Missatge urgent del planeta més ràpid! Mira això abans que s\'escapi.',
    quizText: 'Ets ràpid... però ets llest? Demostra-ho!',
    moons: 0,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/d973e17c-92e3-4631-8c46-14389b064433?artifactId=7ed66502-d6cf-4e96-8c33-7c2bc126c09e',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari de Mercuri a NotebookLM?',
        options: ['Sí, completat', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#E6B874', // Softer Gold
    size: 1.1,
    distance: 12,
    speed: 0.015,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
    description: 'El planeta més calorós del sistema solar.',
    youtubeId: 'y7QpSLd3DCQ',
    videoText: 'Compte amb els núvols! Hem enviat una sonda a través de la boira.',
    quizText: 'Saps per què Venus brilla tant? Resol el misteri!',
    moons: 0,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/c684f72d-eb49-4d65-b0a0-c4c7aef548ea?artifactId=166ea394-172d-41b8-ab14-987ee4af93f6',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari de Venus a NotebookLM?',
        options: ['Sí, missió completada', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'earth',
    name: 'Terra',
    color: '#2E86C1', // Deeper Blue
    size: 1.15,
    distance: 17,
    speed: 0.01,
    textureType: 'rocky',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    description: 'La nostra llar, el planeta blau.',
    youtubeId: 'ASWtl4HdIJQ',
    videoText: 'Transmissió des de casa! Mira el nostre planeta com mai abans.',
    quizText: 'Creus que coneixes casa teva... Segur? Posa\'t a prova.',
    moons: 1,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/09800d3e-4afd-4134-be90-1fb41c163736?artifactId=f69eedf9-d1bf-4404-a0f6-3c39eaf08b33',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari de la Terra a NotebookLM?',
        options: ['Sí, missió completada', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mart',
    color: '#D35400', // Rust Orange
    size: 0.9,
    distance: 22,
    speed: 0.008,
    textureType: 'rocky',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    description: 'El planeta vermell.',
    youtubeId: 'sezt04Hq5RA',
    videoText: 'El Rover ha enviat un vídeo secret des de la superfície vermella!',
    quizText: 'A punt pel teu entrenament d\'astronauta marcià?',
    moons: 2,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/64a58a7e-2781-43b9-9a64-fa504ea165f3?artifactId=f3fd3c22-7b97-435d-a0e6-7af1630641d2',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari de Mart a NotebookLM?',
        options: ['Sí, missió completada', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    color: '#C09F80', // Beige/Brownish
    size: 3.5,
    distance: 32,
    speed: 0.02,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
    description: 'El planeta més gran del sistema solar.',
    youtubeId: 'jFV4dB5AplU',
    videoText: 'És GEGANT! Mira el que ha gravat la nau al passar a prop.',
    quizText: 'Un planeta gran necessita un cervell gran. T\'atreveixes?',
    moons: 4, 
    externalQuizUrl: 'https://notebooklm.google.com/notebook/ca3f78e2-9537-40d3-88c1-62d94b289049?artifactId=53e6f189-94cc-4aca-aa6a-45e9296ca1d3',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari de Júpiter a NotebookLM?',
        options: ['Sí, missió completada', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#F4D03F', // Golden
    size: 3,
    distance: 42,
    speed: 0.018,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    ringColor: '#F7DC6F', // Lighter Gold Rings
    description: 'Famós pels seus espectaculars anells.',
    youtubeId: 'epZdZaEQhS0',
    videoText: 'Els anells estan cantant! Escolta la història del Senyor dels Anells.',
    quizText: 'Pots comptar tots els anells sense marejar-te? Posa a prova el teu saber!',
    moons: 5,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/9423026c-d637-4ee8-9ce2-8743ab6f8f63?artifactId=b94f4900-aaa0-4b8b-911d-db89961d82ce',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari de Saturn a NotebookLM?',
        options: ['Sí, missió completada', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Urà',
    color: '#7FDBFF', // Lighter Cyan
    size: 2.2,
    distance: 50,
    speed: 0.015,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    ringColor: '#A9DFBF', // Very pale green/cyan ring
    description: 'El gegant de gel que gira de costat.',
    youtubeId: '6QvQ3Nq01aI',
    videoText: 'Un planeta que gira de costat? Has de veure això per creure-ho!',
    quizText: 'Aquest planeta és molt fred... no et congelis amb les respostes!',
    moons: 3,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/3ff940e7-c428-41ee-b499-cd291cd398e5?artifactId=8cb0256e-0522-4d7d-bdc6-109ce082db5e',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari d\'Urà a NotebookLM?',
        options: ['Sí, missió completada', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptú',
    color: '#2874A6', // Deep Blue
    size: 2.1,
    distance: 58,
    speed: 0.012,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
    description: 'El planeta més ventós i llunyà.',
    youtubeId: 'NStn75gIhwg',
    videoText: 'Senyal captat des de la vora del sistema! El vent bufa fort.',
    quizText: 'El viatge ha estat llarg... recordes tot el que has après?',
    moons: 3,
    externalQuizUrl: 'https://notebooklm.google.com/notebook/736bf854-3140-49af-a63a-a574b23fea01?artifactId=8b24305f-0be7-4403-a722-491c5c5ab2d1',
    quiz: [
      {
        id: 1,
        text: 'Has completat el qüestionari de Neptú a NotebookLM?',
        options: ['Sí, missió completada', 'Encara no'],
        correctAnswerIndex: 0
      }
    ]
  }
];