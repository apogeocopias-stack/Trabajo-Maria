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
    youtubeId: '0KBjnNuhRHs',
    moons: 0,
    quiz: [
      {
        id: 1,
        text: '¿Cómo es la temperatura en Mercurio?',
        options: ['Siempre fría', 'Muy caliente de día, muy fría de noche', 'Siempre templada'],
        correctAnswerIndex: 1
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
    youtubeId: 'BvrL7fA_2XI',
    moons: 0,
    quiz: [
      {
        id: 1,
        text: '¿Por qué brilla tanto Venus?',
        options: ['Tiene luz propia', 'Refleja mucha luz del Sol por sus nubes', 'Es de oro'],
        correctAnswerIndex: 1
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
    youtubeId: 'HCDVN7QKzYE',
    moons: 1,
    quiz: [
      {
        id: 1,
        text: '¿Cuánto tarda la Tierra en dar una vuelta al Sol?',
        options: ['24 horas', '365 días', '1 mes'],
        correctAnswerIndex: 1
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
    youtubeId: 'D8pnmwOXhoY',
    moons: 2,
    quiz: [
      {
        id: 1,
        text: '¿Por qué Marte es rojo?',
        options: ['Por el óxido de hierro', 'Porque hace calor', 'Por los volcanes'],
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
    youtubeId: 'PtkqwslbLY8',
    moons: 4, 
    quiz: [
      {
        id: 1,
        text: '¿De qué está hecho principalmente Júpiter?',
        options: ['Roca', 'Gas', 'Hielo'],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturno',
    color: '#F0932B',
    size: 3.0,
    distance: 45,
    speed: 0.018,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    ringColor: '#CBA173',
    // A texture that creates the ring bands effect
    ringTextureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Saturn%27s_ring_plane.jpg/1024px-Saturn%27s_ring_plane.jpg', 
    description: 'Famoso por sus impresionantes anillos.',
    youtubeId: 'epZdZaEQhS0',
    moons: 6,
    quiz: [
      {
        id: 1,
        text: '¿De qué están hechos los anillos de Saturno?',
        options: ['Hielo y roca', 'Gas', 'Metal'],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Urano',
    color: '#7ED6DF',
    size: 2.0,
    distance: 58,
    speed: 0.012,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    description: 'El gigante de hielo que gira de lado.',
    youtubeId: '6M3n8j7j2J4',
    moons: 4,
    quiz: [
      {
        id: 1,
        text: '¿Por qué Urano es de color azul verdoso?',
        options: ['Por el agua', 'Por el gas metano', 'Por el frío'],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptuno',
    color: '#4834D4',
    size: 1.9,
    distance: 70,
    speed: 0.011,
    textureType: 'gaseous',
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
    description: 'El planeta más lejano y ventoso.',
    youtubeId: 'N9dn6g4F8s4',
    moons: 3,
    quiz: [
      {
        id: 1,
        text: '¿Es Neptuno el planeta más frío?',
        options: ['Sí, es el más frío', 'No, Urano es más frío', 'No, Mercurio es más frío'],
        correctAnswerIndex: 1
      }
    ]
  }
];