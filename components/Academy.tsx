import React, { useState, useEffect, useRef } from 'react';

interface Props {
  pilotName: string;
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 1,
    title: "Benvingut a bord",
    content: (name: string) => `Hola, Cadet ${name}! Estàs a punt d'entrar a la nau "Max Aub". La nostra missió és la més important de la història de l'escola.`,
    icon: "👋",
    color: "text-yellow-400"
  },
  {
    id: 2,
    title: "Objectiu de la Missió",
    content: () => "Hem de viatjar per tot el Sistema Solar, des del Sol ardent fins al fred Neptú. La teva tasca és recollir dades i resoldre els enigmes de cada planeta.",
    icon: "🎯",
    color: "text-green-400"
  },
  {
    id: 3,
    title: "El Gran Ball: La Translació",
    content: () => "El Sistema Solar està format pel Sol (el capità) i 8 planetes. Tots giren al voltant del Sol en un cercle gegant.\n\nAquest moviment es diu TRANSLACIÓ. És com una ballarina fent voltes pel teatre!",
    icon: "🩰", // Ballerina
    color: "text-orange-400"
  },
  {
    id: 4,
    title: "Gira que giraràs: Rotació",
    content: () => "Compte, no et maregis! 🤢\nEncara que no ho sembli, els planetes també giren sobre ells mateixos com una baldufa.\n\nAixò es diu ROTACIÓ. Gràcies a això tenim dia per jugar i nit per dormir.",
    icon: "🌀", // Spinning top / Cyclone
    color: "text-blue-400"
  },
  {
    id: 5,
    title: "Els Satèl·lits (Planetes Xicotets)",
    content: () => "Alguns planetes tenen 'planetes xicotets' que els persegueixen: són els satèl·lits o llunes.\n\n⚠️ Avís al pilot: Quan aparquis la nau, mira bé on aterres! No et confonguis de planeta i acabis a la Lluna!",
    icon: "🌚", // Moon face
    color: "text-gray-300"
  },
  {
    id: 6,
    title: "Normes de Seguretat",
    content: () => "Norma #1: No obrir la finestra (fa fred fora).\nNorma #2: No donar menjar als marcians.\nNorma #3: Divertir-se molt!",
    icon: "⚠️",
    color: "text-red-400"
  },
  {
    id: 7,
    title: "Comprovació de Sistemes",
    content: () => "Motors... 100%\nOxigen... 100%\nEntrepans per l'esbarjo... 100%\nTot llest per l'enlairament!",
    icon: "✅",
    color: "text-purple-400",
    sound: "engine"
  },
  {
    id: 8,
    title: "Compte Enrere",
    content: () => "Prepara't per al llançament en...",
    icon: "⏱️",
    color: "text-orange-500",
    isCountdown: true,
    sound: "countdown"
  }
];

const Academy: React.FC<Props> = ({ pilotName, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  // Audio effect handler
  useEffect(() => {
    // Stop previous audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    let url = '';
    if (slide.sound === 'engine') {
        // Engine start / Sci-fi hum
        url = 'https://assets.mixkit.co/active_storage/sfx/2650/2650-preview.mp3';
    } else if (slide.sound === 'countdown') {
        // Countdown beeps
        url = 'https://assets.mixkit.co/active_storage/sfx/1597/1597-preview.mp3'; 
    }

    if (url) {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio autoplay prevented", e));
        audioRef.current = audio;
    }

    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };
  }, [currentSlide, slide.sound]);

  useEffect(() => {
    let timer: any;
    if (isLastSlide && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isLastSlide && countdown === 0) {
      timer = setTimeout(onComplete, 1000);
    }
    return () => clearTimeout(timer);
  }, [isLastSlide, countdown, onComplete]);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Star Background (CSS only for simplicity here) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
      </div>

      <div className="z-10 w-full max-w-4xl bg-gray-900/80 backdrop-blur-lg border-2 border-indigo-500/50 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(79,70,229,0.3)] relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-800 rounded-t-3xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex flex-col items-center text-center min-h-[400px] justify-center">
          
          {slide.isCountdown ? (
            <div className="scale-150 animate-bounce">
               <div className="text-9xl font-bold text-red-500 space-font mb-8 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                 {countdown > 0 ? countdown : "GO!"}
               </div>
            </div>
          ) : (
            <div className="text-8xl mb-6 animate-bounce">{slide.icon}</div>
          )}

          <h2 className={`text-4xl md:text-5xl font-bold mb-6 space-font ${slide.color}`}>
            {slide.title}
          </h2>

          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl whitespace-pre-line">
             {typeof slide.content === 'function' ? slide.content(pilotName) : slide.content}
          </div>

        </div>

        {/* Controls */}
        {!slide.isCountdown && (
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-700">
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            >
              ← Anterior
            </button>

            <div className="flex gap-2">
              {SLIDES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white scale-125' : 'bg-gray-600'}`}
                />
              ))}
            </div>

            <button 
              onClick={nextSlide}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              {currentSlide === SLIDES.length - 2 ? 'Llançament!' : 'Següent'} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academy;