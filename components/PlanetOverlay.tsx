
import React, { useState, useEffect } from 'react';
import { Question, QuizResult } from '../types';
import { PLANETS } from '../constants';

interface Props {
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string | null) => void;
  onQuizComplete: (results: QuizResult[]) => void;
  onFinishJourney: () => void;
  avatarUrl?: string;
  pilotName?: string;
}

const PlanetOverlay: React.FC<Props> = ({ 
  selectedPlanetId, 
  onSelectPlanet, 
  onQuizComplete,
  onFinishJourney,
  avatarUrl,
  pilotName
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVideo, setShowVideo] = useState(false); 
  const [quizIndex, setQuizIndex] = useState(0);
  const [localResults, setLocalResults] = useState<QuizResult[]>([]);
  
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedPlanet = PLANETS.find(p => p.id === selectedPlanetId);

  useEffect(() => {
    setShowQuiz(false);
    setShowVideo(false);
    setQuizIndex(0);
    setWrongIndices([]);
    setShowSuccess(false);
    setLocalResults([]);
  }, [selectedPlanetId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error("Error entering fullscreen:", e);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleVideoClick = () => {
    if (!selectedPlanet) return;
    setShowVideo(true);
  };

  const handleMissionClick = () => {
    if (!selectedPlanet) return;
    setQuizIndex(0);
    setWrongIndices([]);
    setShowSuccess(false);
    setShowQuiz(true);
  };

  const finishQuiz = (finalResults: QuizResult[]) => {
      if (!selectedPlanet) return;

      // Removed alert to prevent exiting fullscreen.
      // Wait a moment for the user to see the last success message, then return to solar system.
      setTimeout(() => {
        setShowQuiz(false);
        onSelectPlanet(null); // Return to Solar System view
      }, 1000);
  };

  const handleAnswer = (optionIndex: number) => {
    if (!selectedPlanet || showSuccess) return; 
    
    const question = selectedPlanet.quiz[quizIndex];
    const isCorrect = optionIndex === question.correctAnswerIndex;
    
    if (isCorrect) {
        setShowSuccess(true);

        const isFirstTry = wrongIndices.length === 0;
        
        const newResult: QuizResult = {
            planetId: selectedPlanet.id,
            correct: isFirstTry
        };

        const updatedResults = [...localResults, newResult];
        setLocalResults(updatedResults);
        onQuizComplete(updatedResults); 

        setTimeout(() => {
            if (quizIndex < selectedPlanet.quiz.length - 1) {
                setQuizIndex(prev => prev + 1);
                setWrongIndices([]); 
                setShowSuccess(false);
            } else {
                finishQuiz(updatedResults);
            }
        }, 1500);

    } else {
        if (!wrongIndices.includes(optionIndex)) {
            setWrongIndices(prev => [...prev, optionIndex]);
        }
    }
  };

  // --- ROBUST VIDEO SOURCE HELPER ---
  const getVideoSrc = (input: string) => {
    if (!input) return { embed: "", direct: "" };

    if (input.includes("drive.google.com")) {
        const url = input.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
        return { embed: url, direct: input };
    }

    if (input.startsWith("http") && !input.includes("youtu")) {
        return { embed: input, direct: input };
    }

    let videoId = input;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = input.match(regExp);

    if (match && match[2].length === 11) {
        videoId = match[2];
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&origin=${origin}&widget_referrer=${origin}&playsinline=1&enablejsapi=1`;
    const direct = `https://www.youtube.com/watch?v=${videoId}`;
    
    return { embed, direct };
  };

  const videoLinks = selectedPlanet ? getVideoSrc(selectedPlanet.youtubeId) : { embed: "", direct: "" };

  // Floating Fullscreen Button (Right Side - Hidden on very small screens to save space)
  const FloatingFullscreenButton = () => (
    <button 
        onClick={toggleFullscreen}
        className="hidden sm:block fixed right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-indigo-600/80 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg transition-all z-[60] pointer-events-auto hover:scale-110 group"
        title={isFullscreen ? "Sortir de pantalla completa" : "Pantalla completa"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        )}
      </button>
  );

  // VISTA GENERAL DEL SISTEMA SOLAR (MENÚ IZQUIERDO)
  if (!selectedPlanetId) {
    return (
      <div className="absolute top-0 left-0 h-full w-full z-10 pointer-events-none">
        <FloatingFullscreenButton />
        
        {/* 
          RESPONSIVE SIDEBAR:
          NARROWER VERSION as requested: w-36 sm:w-48 md:w-56
        */}
        <div className="h-full w-36 sm:w-48 md:w-56 p-2 sm:p-3 flex flex-col gap-2 pointer-events-auto overflow-y-auto no-scrollbar bg-black/40 backdrop-blur-md border-r border-white/10 shadow-2xl transition-all duration-300">
           
           {/* Pilot Card (BIGGER & MORE PADDING) */}
           <div className="bg-indigo-900/90 backdrop-blur p-3 sm:p-4 mb-2 rounded-xl border border-indigo-500/50 flex flex-col gap-2 shadow-lg shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {avatarUrl && (
                    <div className="relative shrink-0">
                        <img src={avatarUrl} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] object-cover" alt="Avatar" />
                    </div>
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-indigo-300 uppercase tracking-widest font-bold truncate">Comandant</p>
                    <p className="font-bold text-white text-sm sm:text-base md:text-lg capitalize space-font truncate">{pilotName || 'Explorant...'}</p>
                </div>
              </div>
              
              {/* Integrated Fullscreen Button in Sidebar (Always visible) */}
              <button 
                onClick={toggleFullscreen}
                className="mt-1 text-xs bg-black/40 hover:bg-white/20 text-indigo-200 px-2 py-1.5 rounded flex items-center justify-center gap-1 transition-colors w-full font-medium"
              >
                  {isFullscreen ? '✕ Sortir Pantalla' : '⛶ Pantalla completa'}
              </button>
           </div>

          <button 
            onClick={onFinishJourney}
            className="w-full bg-red-600/90 hover:bg-red-700 text-white p-2 rounded-lg font-bold border border-red-400/50 shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm shrink-0 transition-transform active:scale-95"
          >
            <span>🏠</span> Tornar a Casa
          </button>

          <h3 className="text-yellow-400 font-bold space-font text-sm sm:text-base md:text-lg mt-2 mb-1 drop-shadow-md text-center shrink-0 border-b border-white/10 pb-1">Destinacions</h3>
          
          <div className="flex flex-col gap-1.5 pb-20">
            {PLANETS.map(planet => (
              <button
                key={planet.id}
                onClick={() => onSelectPlanet(planet.id)}
                className="bg-black/40 hover:bg-indigo-600/80 text-white p-1.5 sm:p-2 rounded-lg text-left border border-white/5 hover:border-white/30 transition-all flex items-center gap-2 sm:gap-3 group shrink-0 hover:pl-3"
              >
                 <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/20 shadow-[0_0_5px_rgba(255,255,255,0.2)] shrink-0" style={{backgroundColor: planet.color}}></div>
                 <span className="text-xs sm:text-sm font-medium truncate">{planet.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPlanet) return null;

  // VISTA DE DETALLE DEL PLANETA (MENÚ DERECHO)
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-2 sm:p-4 md:p-6 overflow-hidden">
      <FloatingFullscreenButton />

      {/* Botón de volver - Responsive placement */}
      <div className="pointer-events-auto absolute top-3 left-3 sm:top-4 sm:left-4 z-50">
         <button 
            onClick={() => onSelectPlanet(null)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border-2 border-white/30 shadow-[0_0_15px_rgba(79,70,229,0.5)] font-bold flex items-center gap-1 sm:gap-2 transition-transform hover:scale-105 text-xs sm:text-sm md:text-base backdrop-blur-md"
        >
            <span>←</span> <span className="hidden sm:inline">Tornar al Sistema</span><span className="sm:hidden">Enrere</span>
        </button>
      </div>

      {/* Contenedor Alineado a la derecha verticalmente centrado */}
      <div className="flex flex-col items-end pointer-events-none mt-10 sm:mt-12 h-full justify-center w-full">
        
        {/* Contenedor Planet Info (Responsive Width & Max Height) */}
        <div className="pointer-events-auto max-h-[80vh] overflow-y-auto no-scrollbar flex flex-col gap-2 sm:gap-3 w-56 sm:w-72 md:w-96 transition-all duration-300">
            
            <div className="bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-5 rounded-2xl text-right border-r-4 shadow-[0_0_50px_rgba(0,0,0,0.6)]" style={{borderColor: selectedPlanet.color}}>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold space-font mb-1" style={{color: selectedPlanet.color}}>
                    {selectedPlanet.name}
                </h1>
                <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed border-t border-white/10 pt-2 mt-1">
                    {selectedPlanet.description}
                </p>
            </div>

            {!showQuiz && !showVideo && (
            <div className="flex flex-col gap-2 w-full">
                
                <div 
                    onClick={handleVideoClick}
                    className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-red-600/90 via-orange-500/90 to-red-600/90 backdrop-blur border-2 border-yellow-400 hover:border-white p-2.5 sm:p-3 md:p-4 rounded-xl transition-all transform hover:scale-105 shadow-lg animate-[pulse_1.5s_ease-in-out_infinite]"
                >
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg sm:text-xl md:text-2xl animate-bounce">📺</span>
                        <h3 className="text-yellow-100 font-bold space-font text-[10px] sm:text-xs uppercase tracking-wider drop-shadow-md">
                            Vídeo Secret
                        </h3>
                    </div>
                    <p className="text-white font-bold text-xs sm:text-sm mb-1 drop-shadow-md leading-tight line-clamp-2">{selectedPlanet.videoText}</p>
                    <div className="text-[9px] sm:text-[10px] text-yellow-200 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform mt-1">
                        CLICA PER VEURE ➜
                    </div>
                </div>

                <div 
                    onClick={handleMissionClick}
                    className="group cursor-pointer bg-gradient-to-r from-indigo-900/90 to-blue-900/90 backdrop-blur border-2 border-indigo-500/30 hover:border-indigo-400 p-2.5 sm:p-3 md:p-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg sm:text-xl md:text-2xl">📝</span>
                        <h3 className="text-indigo-300 font-bold space-font text-[10px] sm:text-xs uppercase tracking-wider">Missió</h3>
                    </div>
                    <p className="text-white font-medium text-xs sm:text-sm mb-1 leading-tight line-clamp-2">{selectedPlanet.quizText}</p>
                    <div className="text-[9px] sm:text-[10px] text-indigo-300 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform mt-1">
                        Iniciar Test ➜
                    </div>
                </div>

            </div>
            )}
        </div>
      </div>

      {/* COMPACT VIDEO PLAYER MODAL - RESPONSIVE SIZE */}
      {showVideo && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto p-2 sm:p-4"
            onClick={() => setShowVideo(false)} 
        >
            <div 
                className="relative w-[95%] md:w-[85%] lg:w-[70%] max-w-5xl flex flex-col shadow-2xl animate-scale-in max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-indigo-900/95 rounded-t-xl p-2 sm:p-3 flex justify-between items-center border-x-2 border-t-2 border-indigo-500/50">
                    <h3 className="text-white font-bold text-xs sm:text-sm md:text-lg ml-2 truncate">🎥 {selectedPlanet.name}</h3>
                    <button 
                        onClick={() => setShowVideo(false)}
                        className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-md"
                    >
                        ✕ Tancar
                    </button>
                </div>

                {/* Responsive Aspect Ratio Container */}
                <div className="w-full aspect-video bg-black border-x-2 border-indigo-500/50 relative">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={videoLinks.embed}
                        title="Video Player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                </div>
                
                <div className="bg-indigo-800/95 rounded-b-xl p-2 sm:p-3 border-x-2 border-b-2 border-indigo-500/50 text-center">
                    <a 
                        href={videoLinks.direct} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg transition-transform hover:scale-105 border border-white/30 text-xs sm:text-sm shadow-lg"
                    >
                        Obrir a YouTube
                    </a>
                </div>
            </div>
        </div>
      )}

      {/* QUIZ MODAL - RESPONSIVE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 p-2 sm:p-4">
          {showQuiz && (
              <div className="pointer-events-auto bg-indigo-950/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-yellow-400 shadow-[0_0_100px_rgba(79,70,229,0.6)] w-full max-w-[550px] relative max-h-[90vh] overflow-y-auto flex flex-col">
                  <button 
                    onClick={() => setShowQuiz(false)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/10 hover:bg-red-500/50 p-1.5 sm:p-2 rounded-full text-indigo-300 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                  </button>

                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-1 sm:mb-2 space-font text-yellow-400">
                      Informe: {selectedPlanet.name}
                  </h2>
                  <div className="h-1 w-16 sm:w-24 bg-indigo-500 mx-auto rounded-full mb-3 sm:mb-4"></div>
                  
                  <p className="text-center text-indigo-300 mb-2 text-[10px] sm:text-xs uppercase tracking-widest">
                    Pregunta {quizIndex + 1} de {selectedPlanet.quiz.length}
                  </p>

                  <div className="h-5 sm:h-6 mb-2 text-center">
                      {showSuccess && (
                          <p className="text-green-400 font-bold animate-bounce text-sm sm:text-base">✅ Correcte!</p>
                      )}
                      {wrongIndices.length > 0 && !showSuccess && (
                          <p className="text-red-400 font-bold animate-pulse text-sm sm:text-base">⚠️ Incorrecte</p>
                      )}
                  </div>

                  <div className="mb-3 sm:mb-4 text-center px-1 sm:px-2">
                      <p className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 leading-snug">
                          {selectedPlanet.quiz[quizIndex].text}
                      </p>
                  </div>

                  <div className="grid gap-2 overflow-y-auto flex-1">
                      {selectedPlanet.quiz[quizIndex].options.map((option, idx) => {
                          const isWrong = wrongIndices.includes(idx);
                          const isCorrectAction = showSuccess && idx === selectedPlanet.quiz[quizIndex].correctAnswerIndex;
                          
                          let btnClass = "";
                          if (isWrong) btnClass = "bg-red-500/20 border-red-500 text-red-300 cursor-not-allowed";
                          else if (isCorrectAction) btnClass = "bg-green-500/50 border-green-400 text-white scale-105";
                          else btnClass = "bg-white/5 hover:bg-indigo-600 border-indigo-500/30 text-indigo-400 hover:text-white hover:border-yellow-400";

                          return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={isWrong || showSuccess} 
                                className={`text-left px-3 py-2 sm:px-4 sm:py-3 rounded-xl border transition-all text-sm sm:text-base font-medium group flex items-center gap-2 sm:gap-3 ${btnClass}`}
                            >
                                <span className={`font-bold shrink-0 ${isWrong ? 'text-red-400' : (isCorrectAction ? 'text-white' : 'text-indigo-400 group-hover:text-white')}`}>
                                    {isWrong ? '✕' : (isCorrectAction ? '✓' : String.fromCharCode(65 + idx) + '.')}
                                </span>
                                <span className={isWrong ? 'line-through decoration-red-500/50 opacity-70' : ''}>
                                    {option}
                                </span>
                            </button>
                          );
                      })}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default PlanetOverlay;
