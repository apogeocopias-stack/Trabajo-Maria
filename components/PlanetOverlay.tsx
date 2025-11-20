import React, { useState, useEffect } from 'react';
import { Question, QuizResult } from '../types';
import { PLANETS } from '../constants';

interface Props {
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string | null) => void;
  onQuizComplete: (results: QuizResult[]) => void;
  onFinishJourney: () => void;
  avatarUrl?: string;
}

const PlanetOverlay: React.FC<Props> = ({ 
  selectedPlanetId, 
  onSelectPlanet, 
  onQuizComplete,
  onFinishJourney,
  avatarUrl,
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [localResults, setLocalResults] = useState<QuizResult[]>([]);

  const selectedPlanet = PLANETS.find(p => p.id === selectedPlanetId);

  useEffect(() => {
    // Reset local state when planet changes
    setShowVideo(false);
    setShowQuiz(false);
    setQuizIndex(0);
  }, [selectedPlanetId]);

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    setShowQuiz(true);
  };

  const handleAnswer = (optionIndex: number) => {
    if (!selectedPlanet) return;
    
    const question = selectedPlanet.quiz[quizIndex];
    const isCorrect = optionIndex === question.correctAnswerIndex;
    
    const newResult: QuizResult = {
        planetId: selectedPlanet.id,
        correct: isCorrect
    };

    // Save result logic (simplified)
    const updatedResults = [...localResults, newResult];
    setLocalResults(updatedResults);
    onQuizComplete(updatedResults); // Propagate up

    // Check if there are more questions or finish
    if (quizIndex < selectedPlanet.quiz.length - 1) {
        setQuizIndex(quizIndex + 1);
    } else {
        // Quiz finished for this planet
        alert(isCorrect ? "¡Correcto! 🎉" : "¡Casi! 😅");
        setShowQuiz(false);
        onSelectPlanet(null); // Zoom out
    }
  };

  // If no planet is selected, show the menu
  if (!selectedPlanetId) {
    return (
      <div className="absolute top-0 left-0 h-full w-64 p-4 z-10 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto mt-20">
           <div className="bg-indigo-900/80 backdrop-blur p-4 rounded-xl border border-indigo-500 mb-4 flex items-center gap-3">
              {avatarUrl && <img src={avatarUrl} className="w-12 h-12 rounded-full border-2 border-yellow-400" alt="Avatar" />}
              <div>
                  <p className="text-xs text-indigo-300">Piloto</p>
                  <p className="font-bold text-white">Explorando...</p>
              </div>
           </div>

          <h3 className="text-yellow-400 font-bold space-font text-lg mb-2 drop-shadow-md">Destinos</h3>
          {PLANETS.map(planet => (
            <button
              key={planet.id}
              onClick={() => onSelectPlanet(planet.id)}
              className="bg-black/50 hover:bg-indigo-600/80 text-white p-3 rounded-lg text-left border border-white/10 transition-all flex items-center gap-3 group"
            >
               <div className="w-4 h-4 rounded-full" style={{backgroundColor: planet.color}}></div>
               {planet.name}
            </button>
          ))}

          <button 
            onClick={onFinishJourney}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold border-2 border-red-400 shadow-lg animate-pulse"
          >
            🏠 Vuelta a Casa
          </button>
        </div>
      </div>
    );
  }

  if (!selectedPlanet) return null;
  const isExternalQuiz = !!selectedPlanet.externalQuizUrl;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8">
      {/* Header Info */}
      <div className="flex justify-between items-start pointer-events-auto">
        <button 
            onClick={() => onSelectPlanet(null)}
            className="bg-white/10 backdrop-blur hover:bg-white/20 text-white px-6 py-2 rounded-full border border-white/30"
        >
            ← Volver al espacio
        </button>
        
        <div className="bg-black/70 backdrop-blur p-6 rounded-2xl max-w-md text-right border-r-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{borderColor: selectedPlanet.color}}>
            <h1 className="text-4xl font-bold space-font mb-2" style={{color: selectedPlanet.color}}>{selectedPlanet.name}</h1>
            <p className="text-gray-200 mb-4 text-lg leading-relaxed">{selectedPlanet.description}</p>
            
            <div className="flex gap-2 justify-end flex-wrap">
               {!showVideo && !showQuiz && (
                 <button 
                    onClick={handleVideoClick}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                 >
                    <span>▶️</span> Ver Video
                 </button>
               )}
            </div>
        </div>
      </div>

      {/* Content Modal (Video or Quiz) */}
      {/* Changed from pointer-events-auto to pointer-events-none for the container, 
          and added pointer-events-auto to children to allow clicks only on content */}
      <div className="pointer-events-none flex justify-center items-center flex-grow">
          {showVideo && (
              <div className="pointer-events-auto bg-black p-4 rounded-xl border border-gray-700 shadow-2xl w-full max-w-3xl relative">
                  <button onClick={() => setShowVideo(false)} className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full font-bold z-30 hover:bg-red-600 transition">X</button>
                  <div className="aspect-video w-full bg-gray-900 flex items-center justify-center overflow-hidden rounded-lg">
                      {/* YouTube Embed with origin fix, rel=0, modestbranding, and playsinline */}
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${selectedPlanet.youtubeId}?autoplay=1&origin=${window.location.origin}&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`} 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                  </div>
                  
                  <div className="mt-2 text-center">
                      <a 
                        href={`https://www.youtube.com/watch?v=${selectedPlanet.youtubeId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-sm underline"
                      >
                        ⚠️ ¿Problemas con el video? Ver directamente en YouTube
                      </a>
                  </div>

                  <button 
                    onClick={handleVideoEnd}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-xl shadow-lg transform transition hover:scale-105"
                  >
                      ¡Ya lo he visto! Ir a las preguntas
                  </button>
              </div>
          )}

          {showQuiz && (
              <div className="pointer-events-auto bg-indigo-900/90 backdrop-blur-lg p-8 rounded-2xl border-2 border-indigo-400 shadow-2xl w-full max-w-2xl">
                  <h2 className="text-2xl font-bold text-center mb-6 space-font text-white">
                      Pregunta sobre {selectedPlanet.name}
                  </h2>
                  
                  {isExternalQuiz && (
                    <div className="mb-8 bg-blue-900/50 p-4 rounded-xl border border-blue-400/50 text-center">
                       <p className="text-lg text-blue-200 mb-4">
                         Para completar esta misión, debes resolver el cuestionario interactivo en NotebookLM.
                       </p>
                       <a 
                         href={selectedPlanet.externalQuizUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-block bg-white text-blue-900 font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
                       >
                         🚀 Abrir Cuestionario NotebookLM
                       </a>
                       <p className="text-xs text-blue-300 mt-2">Se abrirá en una nueva pestaña</p>
                    </div>
                  )}

                  <div className="mb-8">
                      <p className="text-xl text-center font-medium text-indigo-100">
                          {isExternalQuiz ? "Verificación de Misión: ¿Lograste completar el cuestionario correctamente?" : selectedPlanet.quiz[quizIndex].text}
                      </p>
                  </div>

                  <div className="grid gap-4">
                      {selectedPlanet.quiz[quizIndex].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`bg-white/10 hover:bg-white/30 text-left p-4 rounded-xl border border-white/20 transition-all text-lg font-medium hover:border-yellow-400 focus:ring-2 focus:ring-yellow-400 ${isExternalQuiz && idx === 0 ? 'bg-green-600/20 border-green-500/50 hover:bg-green-600/40' : ''}`}
                          >
                              {option}
                          </button>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default PlanetOverlay;