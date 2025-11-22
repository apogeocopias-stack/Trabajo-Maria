
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
    youtubeId: '1GILzyh3Axc',
    videoText: 'Atenció! Els filtres solars estan llestos. Vols veure el foc de prop?',
    quizText: 'Suportaràs la calor d\'aquestes preguntes?',
    moons: 0,
    quiz: [
      {
        id: 1,
        text: 'De què està fet principalment el Sol?',
        options: ['Roca fosa', 'Hidrogen i Heli', 'Foc màgic'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Quant triga la llum del Sol en arribar a la Terra?',
        options: ['1 segon', '8 minuts', '24 hores'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        text: 'Quina temperatura fa a la superfície del Sol?',
        options: ['100 graus', '1.000 graus', '5.500 graus'],
        correctAnswerIndex: 2
      },
      {
        id: 4,
        text: 'Què passaria si el Sol s\'apagués de cop?',
        options: ['Ens quedaríem a les fosques i ens congelaríem', 'Faríem servir llanternes', 'La Lluna ens donaria llum'],
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
    youtubeId: 'QLqcgG0uSoM',
    videoText: 'Missatge urgent del planeta més ràpid! Mira això abans que s\'escapi.',
    quizText: 'Ets ràpid... però ets llest? Demostra-ho!',
    moons: 0,
    quiz: [
      {
        id: 1,
        text: 'Com és la superfície de Mercuri?',
        options: ['Llisa com una pilota', 'Plena de forats (cràters)', 'Plena d\'aigua'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Fa calor o fred a Mercuri?',
        options: ['Sempre fa calor', 'Sempre fa fred', 'De dia crema i de nit gela'],
        correctAnswerIndex: 2
      },
      {
        id: 3,
        text: 'Té atmosfera per respirar?',
        options: ['Sí, molt bona', 'No, no té aire', 'Només una mica'],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        text: 'Com de ràpid va al voltant del Sol?',
        options: ['És el més lent', 'És el més ràpid de tots', 'Va a la mateixa velocitat que la Terra'],
        correctAnswerIndex: 1
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
    youtubeId: 'OVqHbV1nEi4',
    videoText: 'Compte amb els núvols! Hem enviat una sonda a través de la boira.',
    quizText: 'Saps per què Venus brilla tant? Resol el misteri!',
    moons: 0,
    quiz: [
      {
        id: 1,
        text: 'Per què Venus brilla tant al cel?',
        options: ['Perquè té llum pròpia', 'Pels seus núvols espessos que reflecteixen el Sol', 'Perquè és un mirall'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Es coneix com el "germà" de la Terra perquè...',
        options: ['Tenen una mida similar', 'Tenen vida', 'Són del mateix color'],
        correctAnswerIndex: 0
      },
      {
        id: 3,
        text: 'Què passa si trepitges Venus?',
        options: ['Res, és agradable', 'Flotaries', 'T\'aixafaria la pressió i la calor'],
        correctAnswerIndex: 2
      },
      {
        id: 4,
        text: 'Una curiositat boja de Venus:',
        options: ['Té anells quadrats', 'Gira al revés que els altres', 'És un cub'],
        correctAnswerIndex: 1
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
    youtubeId: 'OoCoWuT962g',
    videoText: 'Transmissió des de casa! Mira el nostre planeta com mai abans.',
    quizText: 'Creus que coneixes casa teva... Segur? Posa\'t a prova.',
    moons: 1,
    quiz: [
      {
        id: 1,
        text: 'Quin moviment de la Terra crea el dia i la nit?',
        options: ['Translació (volta al Sol)', 'Rotació (volta sobre si mateixa)', 'Vibració'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Quina part de la superfície de la Terra és aigua?',
        options: ['La meitat (50%)', 'Molt poca (10%)', 'Un 70% (tres quartes parts)'],
        correctAnswerIndex: 2
      },
      {
        id: 3,
        text: 'Quines són les tres capes principals de la Terra?',
        options: ['Escorça, mantell i nucli', 'Pedra, aigua i aire', 'Pell, carn i ós'],
        correctAnswerIndex: 0
      },
      {
        id: 4,
        text: 'El gas més abundant a la nostra atmosfera és...',
        options: ['L\'Oxigen', 'El Nitrogen', 'El Diòxid de Carboni'],
        correctAnswerIndex: 1
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
    quiz: [
      {
        id: 1,
        text: 'Per què és de color vermell?',
        options: ['Perquè fa calor', 'Pel ferro rovellat a la sorra', 'Perquè està enfadat'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Quina muntanya famosa té Mart?',
        options: ['L\'Everest', 'El Mont Blanc', 'L\'Olimp, la més alta de totes'],
        correctAnswerIndex: 2
      },
      {
        id: 3,
        text: 'Hi viuen marcians verds?',
        options: ['Sí, a tot arreu', 'No, però hi hem enviat robots', 'Sí, sota terra'],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        text: 'Hi ha aigua a Mart?',
        options: ['No, és tot desert', 'Sí, rius grans', 'Sí, però congelada als pols'],
        correctAnswerIndex: 2
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
    youtubeId: 'srLadulE2B4',
    videoText: 'És GEGANT! Mira el que ha gravat la nau al passar a prop.',
    quizText: 'Un planeta gran necessita un cervell gran. T\'atreveixes?',
    moons: 4, 
    quiz: [
      {
        id: 1,
        text: 'Com és de gran Júpiter?',
        options: ['Com la Terra', 'Hi cabrien 1.300 Terres a dins', 'Més petit que la Lluna'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Què és la Gran Taca Vermella?',
        options: ['Una muntanya', 'Un volcà', 'Una tempesta gegant'],
        correctAnswerIndex: 2
      },
      {
        id: 3,
        text: 'És un planeta sòlid on pots trepitjar?',
        options: ['Sí, és clar', 'No, és una bola de gas', 'És líquid'],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        text: 'Té llunes Júpiter?',
        options: ['Cap', 'Una o dues', 'Moltíssimes, més de 70'],
        correctAnswerIndex: 2
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
    youtubeId: 'WanHhka2qns',
    videoText: 'Els anells estan cantant! Escolta la història del Senyor dels Anells.',
    quizText: 'Pots comptar tots els anells sense marejar-te? Posa a prova el teu saber!',
    moons: 5,
    quiz: [
      {
        id: 1,
        text: 'Què fa únic a Saturn?',
        options: ['És quadrat', 'Els seus anells brillants', 'És de color rosa'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Si poséssim Saturn en una piscina gegant...',
        options: ['S\'enfonsaria', 'Suraria com una pilota', 'Es dissoldria'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        text: 'De què estan fets els anells?',
        options: ['Or i plata', 'Boles de gel i roques', 'Gasos de colors'],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        text: 'És un gegant de...',
        options: ['Roca', 'Foc', 'Gas, com Júpiter'],
        correctAnswerIndex: 2
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
    youtubeId: 'BDQEZwukOd8',
    videoText: 'Un planeta que gira de costat? Has de veure això per creure-ho!',
    quizText: 'Aquest planeta és molt fred... no et congelis amb les respostes!',
    moons: 3,
    quiz: [
      {
        id: 1,
        text: 'De quin color és Urà?',
        options: ['Vermell', 'Blau cel', 'Groc'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        text: 'Quina raresa fa Urà al girar?',
        options: ['Gira molt ràpid', 'Gira tombat, de costat', 'No gira'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        text: 'Fa calor allà?',
        options: ['Sí, molta', 'Ni fred ni calor', 'No! És un gegant de gel'],
        correctAnswerIndex: 2
      },
      {
        id: 4,
        text: 'Té anells Urà?',
        options: ['No en té', 'Sí, però són molt fins i foscos', 'Sí, fets de foc'],
        correctAnswerIndex: 1
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
    youtubeId: 'HteGQfShm84',
    videoText: 'Senyal captat des de la vora del sistema! El vent bufa fort.',
    quizText: 'El viatge ha estat llarg... recordes tot el que has après?',
    moons: 3,
    quiz: [
      {
        id: 1,
        text: 'Per què és el planeta més fosc i fred?',
        options: ['Perquè és el més llunyà del Sol', 'Perquè sempre és de nit', 'Perquè és de gel'],
        correctAnswerIndex: 0
      },
      {
        id: 2,
        text: 'Quin temps fa a Neptú?',
        options: ['Sol i platja', 'Molt de vent i tempestes', 'Tranquil'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        text: 'Quant triga a donar la volta al Sol?',
        options: ['1 any', '10 anys', 'Moltíssim, 165 anys'],
        correctAnswerIndex: 2
      },
      {
        id: 4,
        text: 'De quin color el veiem?',
        options: ['Verd', 'Blau fosc intens', 'Gris'],
        correctAnswerIndex: 1
      }
    ]
  }
];
