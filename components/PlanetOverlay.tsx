
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

      const correctFirstTry = finalResults.filter(r => r.planetId === selectedPlanet.id && r.correct).length;
      const total = selectedPlanet.quiz.length;
      
      let message = "";
      if (correctFirstTry === total) message = "Perfecte! Ets un expert! 🌟";
      else if (correctFirstTry >= total / 2) message = "Molt bé! Missió complerta. 👍";
      else message = "Bona feina! Has après moltes coses noves.";

      setTimeout(() => {
        alert(`${message}\nHas encertat a la primera: ${correctFirstTry} de ${total} preguntes.`);
        setShowQuiz(false);
        onSelectPlanet(null); 
      }, 500);
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

  // --- ROBUST VIDEO SOURCE HELPER (MAX COMPATIBILITY) ---
  const getVideoSrc = (input: string) => {
    if (!input) return { embed: "", direct: "" };

    // 1. Handle Google Drive
    if (input.includes("drive.google.com")) {
        const url = input.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
        return { embed: url, direct: input };
    }

    // 2. Handle Generic HTTP (Vimeo, etc, but not YouTube)
    if (input.startsWith("http") && !input.includes("youtu")) {
        return { embed: input, direct: input };
    }

    // 3. Handle YouTube
    let videoId = input;
    
    // Regex to extract ID from various YouTube URL formats
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

  // Botón de pantalla completa rediseñado y posicionado
  const FullscreenButton = () => (
    <button 
        onClick={toggleFullscreen}
        className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-indigo-600 backdrop-blur-md text-white p-4 rounded-full border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all z-[60] pointer-events-auto hover:scale-110 group"
        title={isFullscreen ? "Sortir de pantalla completa" : "Pantalla completa"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        )}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {isFullscreen ? "Minimitzar" : "Pantalla Completa"}
        </span>
      </button>
  );

  // VISTA GENERAL DEL SISTEMA SOLAR (MENÚ IZQUIERDO)
  if (!selectedPlanetId) {
    return (
      <div className="absolute top-0 left-0 h-full w-full z-10 pointer-events-none">
        <FullscreenButton />
        
        {/* Adjusted width for Surface Pro (w-72 on md, w-96 on lg) and max-height for scrolling */}
        <div className="h-full w-full sm:w-72 md:w-80 lg:w-96 p-4 md:p-6 flex flex-col gap-3 pointer-events-auto overflow-y-auto max-h-screen no-scrollbar">
           
           {/* Pilot Card */}
           <div className="bg-indigo-900/80 backdrop-blur p-4 rounded-2xl border-2 border-indigo-500 mb-2 flex items-center gap-4 shadow-2xl shrink-0">
              {avatarUrl && (
                  <div className="relative shrink-0">
                      <img src={avatarUrl} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] object-cover" alt="Avatar" />
                      <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
              )}
              <div className="flex-1 min-w-0">
                  <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Comandant</p>
                  <p className="font-bold text-white text-lg md:text-xl capitalize space-font truncate">{pilotName || 'Explorant...'}</p>
              </div>
           </div>

          <button 
            onClick={onFinishJourney}
            className="mb-2 w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-bold border-2 border-red-400 shadow-lg animate-pulse flex items-center justify-center gap-2 text-base shrink-0 transition-transform active:scale-95"
          >
            <span>🏠</span> Tornar a Casa
          </button>

          <h3 className="text-yellow-400 font-bold space-font text-lg md:text-xl mb-1 drop-shadow-md text-center shrink-0">Destinacions</h3>
          
          <div className="flex flex-col gap-2 pb-10">
            {PLANETS.map(planet => (
              <button
                key={planet.id}
                onClick={() => onSelectPlanet(planet.id)}
                className="bg-black/60 hover:bg-indigo-600/80 text-white p-2.5 rounded-xl text-left border border-white/10 transition-all flex items-center gap-3 group shrink-0 hover:pl-4"
              >
                 <div className="w-5 h-5 rounded-full border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)] shrink-0" style={{backgroundColor: planet.color}}></div>
                 <span className="text-base md:text-lg font-medium">{planet.name}</span>
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
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 md:p-6 lg:p-8">
      <FullscreenButton />

      {/* Botón de volver mejorado y posicionado */}
      <div className="pointer-events-auto absolute top-4 left-4 md:top-6 md:left-6 z-30">
         <button 
            onClick={() => onSelectPlanet(null)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full border-2 border-white/30 shadow-[0_0_15px_rgba(79,70,229,0.5)] font-bold flex items-center gap-2 transition-transform hover:scale-105"
        >
            <span className="text-xl">←</span> Tornar
        </button>
      </div>

      <div className="flex flex-col items-end pointer-events-none mt-12 h-full justify-center">
        
        {/* Contenedor con scroll para pantallas pequeñas */}
        <div className="pointer-events-auto max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col gap-4 w-full max-w-sm">
            
            <div className="bg-black/80 backdrop-blur-md p-5 rounded-2xl text-right border-r-4 shadow-[0_0_50px_rgba(0,0,0,0.6)]" style={{borderColor: selectedPlanet.color}}>
                <h1 className="text-3xl md:text-4xl font-bold space-font mb-2" style={{color: selectedPlanet.color}}>
                    {selectedPlanet.name}
                </h1>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed border-t border-white/10 pt-3 mt-2">
                    {selectedPlanet.description}
                </p>
            </div>

            {!showQuiz && !showVideo && (
            <div className="flex flex-col gap-3 w-full">
                
                <div 
                    onClick={handleVideoClick}
                    className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-red-600/90 via-orange-500/90 to-red-600/90 backdrop-blur border-2 border-yellow-400 hover:border-white p-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg animate-[pulse_1.5s_ease-in-out_infinite]"
                >
                    <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl md:text-3xl animate-bounce">📺</span>
                        <h3 className="text-yellow-100 font-bold space-font text-xs md:text-sm uppercase tracking-wider drop-shadow-md">
                            Transmissió Entrant
                        </h3>
                    </div>
                    <p className="text-white font-bold text-sm md:text-base mb-2 drop-shadow-md leading-tight">{selectedPlanet.videoText}</p>
                    <div className="text-xs text-yellow-200 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform mt-2">
                        🎥 CLICA PER VEURE VÍDEO ➜
                    </div>
                </div>

                <div 
                    onClick={handleMissionClick}
                    className="group cursor-pointer bg-gradient-to-r from-indigo-900/90 to-blue-900/90 backdrop-blur border-2 border-indigo-500/30 hover:border-indigo-400 p-4 rounded-2xl transition-all transform hover:scale-105 hover:shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl md:text-3xl">📝</span>
                        <h3 className="text-indigo-300 font-bold space-font text-xs md:text-sm uppercase tracking-wider">Repte de Cadet</h3>
                    </div>
                    <p className="text-white font-medium text-sm md:text-base mb-2 leading-tight">{selectedPlanet.quizText}</p>
                    <div className="text-xs text-indigo-300 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform mt-2">
                        Iniciar Test ➜
                    </div>
                </div>

            </div>
            )}
        </div>
      </div>

      {/* COMPACT VIDEO PLAYER MODAL - CLICAR FUERA PARA CERRAR */}
      {showVideo && (
        <div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto p-4 md:p-10"
            onClick={() => setShowVideo(false)} // Clicar al fondo cierra el modal
        >
            <div 
                className="relative w-full max-w-lg md:max-w-4xl flex flex-col gap-0 animate-fade-in shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Evitar cierre si clicas DENTRO del contenido
            >
                
                {/* Header bar with close button */}
                <div className="bg-indigo-900/90 rounded-t-2xl p-3 md:p-4 flex justify-between items-center border-x-2 border-t-2 border-indigo-500/50">
                    <h3 className="text-white font-bold text-base md:text-xl ml-2 truncate">🎥 {selectedPlanet.name}</h3>
                    <button 
                        onClick={() => setShowVideo(false)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-md"
                    >
                        ✕ Tancar
                    </button>
                </div>

                {/* Video Container */}
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
                        referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                </div>
                
                {/* Fallback Footer */}
                <div className="bg-indigo-800/90 rounded-b-2xl p-4 border-x-2 border-b-2 border-indigo-500/50 text-center">
                    <a 
                        href={videoLinks.direct} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105 border border-white/30 text-sm md:text-base shadow-lg flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>▶️</span> Veure a YouTube (Pestanya Nova)
                    </a>
                </div>

            </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {showQuiz && (
              <div className="pointer-events-auto bg-indigo-950/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl border-2 border-yellow-400 shadow-[0_0_100px_rgba(79,70,229,0.6)] w-full max-w-2xl m-4 relative max-h-[90vh] overflow-y-auto">
                  <button 
                    onClick={() => setShowQuiz(false)}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-red-500/50 p-2 rounded-full text-indigo-300 hover:text-white transition-colors"
                  >
                    ✕
                  </button>

                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 space-font text-yellow-400">
                      Informe: {selectedPlanet.name}
                  </h2>
                  <div className="h-1 w-32 bg-indigo-500 mx-auto rounded-full mb-4 md:mb-6"></div>
                  
                  <p className="text-center text-indigo-300 mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-widest">
                    Pregunta {quizIndex + 1} de {selectedPlanet.quiz.length}
                  </p>

                  <div className="h-6 md:h-8 text-center mb-2">
                      {showSuccess && (
                          <p className="text-green-400 font-bold animate-bounce text-base md:text-lg">✅ Correcte! Molt bé! 🚀</p>
                      )}
                      {wrongIndices.length > 0 && !showSuccess && (
                          <p className="text-red-400 font-bold animate-pulse text-base md:text-lg">⚠️ Incorrecte. Torna-ho a provar!</p>
                      )}
                  </div>

                  <div className="mb-4 md:mb-6 text-center px-2">
                      <p className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                          {selectedPlanet.quiz[quizIndex].text}
                      </p>
                  </div>

                  <div className="grid gap-3">
                      {selectedPlanet.quiz[quizIndex].options.map((option, idx) => {
                          const isWrong = wrongIndices.includes(idx);
                          const isCorrectAction = showSuccess && idx === selectedPlanet.quiz[quizIndex].correctAnswerIndex;
                          
                          let btnClass = "";
                          
                          if (isWrong) {
                              btnClass = "bg-red-500/20 border-red-500 text-red-300 cursor-not-allowed";
                          } else if (isCorrectAction) {
                              btnClass = "bg-green-500/50 border-green-400 text-white scale-105 shadow-[0_0_20px_rgba(74,222,128,0.5)]";
                          } else {
                              btnClass = "bg-white/5 hover:bg-indigo-600 border-indigo-500/30 text-indigo-400 hover:text-white hover:scale-102 hover:shadow-lg hover:border-yellow-400";
                          }

                          return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={isWrong || showSuccess} 
                                className={`text-left px-5 py-3 md:px-6 md:py-4 rounded-xl border transition-all text-base md:text-lg font-medium group flex items-center gap-3 ${btnClass}`}
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
