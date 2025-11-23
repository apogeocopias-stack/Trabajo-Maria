
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

    // Use STANDARD youtube.com domain. 
    // Ironically, youtube-nocookie often gets blocked by privacy settings more than the standard one if origin is missing.
    // Adding 'origin' matches the request to the domain, reducing "Video unavailable" errors.
    // Adding 'playsinline' fixes iOS fullscreen forcing.
    const origin = window.location.origin;
    const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&origin=${origin}&playsinline=1&enablejsapi=1`;
    const direct = `https://www.youtube.com/watch?v=${videoId}`;
    
    return { embed, direct };
  };

  const videoLinks = selectedPlanet ? getVideoSrc(selectedPlanet.youtubeId) : { embed: "", direct: "" };

  const FullscreenButton = () => (
    <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-blue-600/90 hover:bg-blue-500 text-white p-3 rounded-full border-2 border-white/30 shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all z-50 pointer-events-auto hover:scale-110"
        title={isFullscreen ? "Sortir de pantalla completa" : "Pantalla completa"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        )}
      </button>
  );

  if (!selectedPlanetId) {
    return (
      <div className="absolute top-0 left-0 h-full w-full z-10 pointer-events-none">
        <FullscreenButton />
        
        <div className="h-full w-96 p-6 flex flex-col gap-4 pointer-events-auto mt-16">
           <div className="bg-indigo-900/80 backdrop-blur p-6 rounded-2xl border-2 border-indigo-500 mb-4 flex flex-col items-center text-center gap-3 shadow-2xl">
              {avatarUrl && (
                  <div className="relative">
                      <img src={avatarUrl} className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] object-cover" alt="Avatar" />
                      <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                  </div>
              )}
              <div className="w-full">
                  <p className="text-sm text-indigo-300 uppercase tracking-widest font-bold mb-1">Comandant</p>
                  <p className="font-bold text-white text-2xl capitalize space-font drop-shadow-md">{pilotName || 'Explorant...'}</p>
              </div>
           </div>

          <button 
            onClick={onFinishJourney}
            className="mb-4 w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold border-2 border-red-400 shadow-lg animate-pulse flex items-center justify-center gap-2 text-lg"
          >
            <span>🏠</span> Tornar a Casa
          </button>

          <h3 className="text-yellow-400 font-bold space-font text-xl mb-2 drop-shadow-md text-center">Destinacions</h3>
          
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] pr-2">
            {PLANETS.map(planet => (
              <button
                key={planet.id}
                onClick={() => onSelectPlanet(planet.id)}
                className="bg-black/60 hover:bg-indigo-600/80 text-white p-3 rounded-xl text-left border border-white/10 transition-all flex items-center gap-3 group shrink-0"
              >
                 <div className="w-6 h-6 rounded-full border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{backgroundColor: planet.color}}></div>
                 <span className="text-lg font-medium">{planet.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPlanet) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-8">
      <FullscreenButton />

      <div className="pointer-events-auto">
         <button 
            onClick={() => onSelectPlanet(null)}
            className="bg-white/10 backdrop-blur hover:bg-white/20 text-white px-6 py-2 rounded-full border border-white/30 shadow-lg"
        >
            ← Tornar a l'espai
        </button>
      </div>

      <div className="flex flex-col items-end pointer-events-none mt-4 h-full justify-center">
        
        <div className="pointer-events-auto bg-black/80 backdrop-blur-md p-5 rounded-2xl max-w-sm text-right border-r-4 shadow-[0_0_50px_rgba(0,0,0,0.6)] mb-4" style={{borderColor: selectedPlanet.color}}>
            <h1 className="text-3xl font-bold space-font mb-1" style={{color: selectedPlanet.color}}>
                {selectedPlanet.name}
            </h1>
            <p className="text-gray-200 text-sm leading-relaxed border-t border-white/10 pt-3 mt-2">
                {selectedPlanet.description}
            </p>
        </div>

        {!showQuiz && !showVideo && (
           <div className="pointer-events-auto flex flex-col gap-4 max-w-sm w-full">
              
              <div 
                 onClick={handleVideoClick}
                 className="group cursor-pointer relative overflow-hidden bg-gradient-to-br from-red-600/90 via-orange-500/90 to-red-600/90 backdrop-blur border-2 border-yellow-400 hover:border-white p-4 rounded-2xl transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(220,38,38,0.7)] animate-[pulse_1.5s_ease-in-out_infinite]"
              >
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
                  <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl animate-bounce">📺</span>
                      <h3 className="text-yellow-100 font-bold space-font text-sm uppercase tracking-wider drop-shadow-md">
                        ⚠️ Transmissió Entrant
                      </h3>
                  </div>
                  <p className="text-white font-bold text-base mb-2 drop-shadow-md">{selectedPlanet.videoText}</p>
                  <div className="text-xs text-yellow-200 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      🎥 CLICA PER VEURE VÍDEO ➜
                  </div>
              </div>

              <div 
                 onClick={handleMissionClick}
                 className="group cursor-pointer bg-gradient-to-r from-indigo-900/90 to-blue-900/90 backdrop-blur border-2 border-indigo-500/30 hover:border-indigo-400 p-4 rounded-2xl transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                  <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">📝</span>
                      <h3 className="text-indigo-300 font-bold space-font text-sm uppercase tracking-wider">Repte de Cadet</h3>
                  </div>
                  <p className="text-white font-medium text-base mb-2">{selectedPlanet.quizText}</p>
                  <div className="text-xs text-indigo-300 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      Iniciar Test ➜
                  </div>
              </div>

           </div>
        )}
      </div>

      {/* COMPACT VIDEO PLAYER MODAL */}
      {showVideo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto p-4">
            <div className="relative w-full max-w-lg flex flex-col gap-0 animate-fade-in shadow-2xl">
                
                {/* Header bar with close button */}
                <div className="bg-indigo-900/90 rounded-t-2xl p-3 flex justify-between items-center border-x-2 border-t-2 border-indigo-500/50">
                    <h3 className="text-white font-bold ml-2">🎥 Transmissió de {selectedPlanet.name}</h3>
                    <button 
                        onClick={() => setShowVideo(false)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm transition-colors"
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
                
                {/* Fallback Footer - Very visible */}
                <div className="bg-indigo-800/90 rounded-b-2xl p-4 border-x-2 border-b-2 border-indigo-500/50 text-center">
                    <p className="text-indigo-200 text-xs mb-3">
                        Si la pantalla està negre o surt "No disponible", és per seguretat del navegador.
                    </p>
                    <a 
                        href={videoLinks.direct} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105 border border-white/30 text-sm shadow-lg flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>▶️</span> Clica aquí per veure a YouTube
                    </a>
                </div>

            </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {showQuiz && (
              <div className="pointer-events-auto bg-indigo-950/95 backdrop-blur-xl p-8 rounded-3xl border-2 border-yellow-400 shadow-[0_0_100px_rgba(79,70,229,0.6)] w-full max-w-2xl m-4 relative">
                  <button 
                    onClick={() => setShowQuiz(false)}
                    className="absolute top-4 right-4 text-indigo-300 hover:text-white"
                  >
                    ✕ Tancar
                  </button>

                  <h2 className="text-3xl font-bold text-center mb-2 space-font text-yellow-400">
                      Informe de Missió: {selectedPlanet.name}
                  </h2>
                  <div className="h-1 w-32 bg-indigo-500 mx-auto rounded-full mb-6"></div>
                  
                  <p className="text-center text-indigo-300 mb-4 text-sm uppercase tracking-widest">
                    Pregunta {quizIndex + 1} de {selectedPlanet.quiz.length}
                  </p>

                  <div className="h-8 text-center mb-2">
                      {showSuccess && (
                          <p className="text-green-400 font-bold animate-bounce text-lg">✅ Correcte! Molt bé! 🚀</p>
                      )}
                      {wrongIndices.length > 0 && !showSuccess && (
                          <p className="text-red-400 font-bold animate-pulse">⚠️ Resposta incorrecta. Torna-ho a provar!</p>
                      )}
                  </div>

                  <div className="mb-6 text-center">
                      <p className="text-2xl font-bold text-white mb-2 leading-snug">
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
                                className={`text-left px-6 py-4 rounded-xl border transition-all text-lg font-medium group flex items-center gap-3 ${btnClass}`}
                            >
                                <span className={`font-bold ${isWrong ? 'text-red-400' : (isCorrectAction ? 'text-white' : 'text-indigo-400 group-hover:text-white')}`}>
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
