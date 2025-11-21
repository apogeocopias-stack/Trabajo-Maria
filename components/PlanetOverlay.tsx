
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
  const [quizIndex, setQuizIndex] = useState(0);
  const [localResults, setLocalResults] = useState<QuizResult[]>([]);

  const selectedPlanet = PLANETS.find(p => p.id === selectedPlanetId);

  useEffect(() => {
    // Reset local state when planet changes
    setShowQuiz(false);
    setQuizIndex(0);
  }, [selectedPlanetId]);

  const handleVideoClick = () => {
    if (!selectedPlanet) return;
    // Open YouTube in a new tab
    const url = `https://www.youtube.com/watch?v=${selectedPlanet.youtubeId}`;
    window.open(url, '_blank');
  };

  const handleMissionClick = () => {
    if (!selectedPlanet) return;
    
    if (selectedPlanet.externalQuizUrl) {
        // If external quiz (NotebookLM), open in new tab
        window.open(selectedPlanet.externalQuizUrl, '_blank');
        // Also show the internal validation quiz
        setShowQuiz(true);
    } else {
        // If internal quiz only
        setShowQuiz(true);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (!selectedPlanet) return;
    
    const question = selectedPlanet.quiz[quizIndex];
    const isCorrect = optionIndex === question.correctAnswerIndex;
    
    const newResult: QuizResult = {
        planetId: selectedPlanet.id,
        correct: isCorrect
    };

    // Save result logic
    const updatedResults = [...localResults, newResult];
    setLocalResults(updatedResults);
    onQuizComplete(updatedResults); 

    // Check if there are more questions or finish
    if (quizIndex < selectedPlanet.quiz.length - 1) {
        setQuizIndex(quizIndex + 1);
    } else {
        // Quiz finished
        alert(isCorrect ? "Missió Complerta! 🎉 Has guanyat la teva insígnia." : "Gairebé! 😅 Segueix explorant.");
        setShowQuiz(false);
        onSelectPlanet(null); // Zoom out
    }
  };

  // If no planet is selected, show the menu
  if (!selectedPlanetId) {
    return (
      <div className="absolute top-0 left-0 h-full w-64 p-4 z-10 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto mt-20">
           <div className="bg-indigo-900/80 backdrop-blur p-4 rounded-xl border border-indigo-500 mb-4 flex items-center gap-3 shadow-lg">
              {avatarUrl && <img src={avatarUrl} className="w-12 h-12 rounded-full border-2 border-yellow-400" alt="Avatar" />}
              <div>
                  <p className="text-xs text-indigo-300">Pilot</p>
                  <p className="font-bold text-white capitalize">{pilotName || 'Explorant...'}</p>
              </div>
           </div>

          <h3 className="text-yellow-400 font-bold space-font text-lg mb-2 drop-shadow-md">Destinacions</h3>
          {PLANETS.map(planet => (
            <button
              key={planet.id}
              onClick={() => onSelectPlanet(planet.id)}
              className="bg-black/50 hover:bg-indigo-600/80 text-white p-3 rounded-lg text-left border border-white/10 transition-all flex items-center gap-3 group"
            >
               <div className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor: planet.color}}></div>
               {planet.name}
            </button>
          ))}

          <button 
            onClick={onFinishJourney}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold border-2 border-red-400 shadow-lg animate-pulse"
          >
            🏠 Tornar a Casa
          </button>
        </div>
      </div>
    );
  }

  if (!selectedPlanet) return null;
  const isExternalQuiz = !!selectedPlanet.externalQuizUrl;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-8">
      {/* Navigation */}
      <div className="pointer-events-auto">
         <button 
            onClick={() => onSelectPlanet(null)}
            className="bg-white/10 backdrop-blur hover:bg-white/20 text-white px-6 py-2 rounded-full border border-white/30 shadow-lg"
        >
            ← Tornar a l'espai
        </button>
      </div>

      {/* Right Panel - Info & Missions */}
      <div className="flex flex-col items-end pointer-events-none mt-4 h-full justify-center">
        
        {/* Planet Info Card */}
        <div className="pointer-events-auto bg-black/80 backdrop-blur-md p-6 rounded-3xl max-w-md text-right border-r-4 shadow-[0_0_50px_rgba(0,0,0,0.6)] mb-6" style={{borderColor: selectedPlanet.color}}>
            <h1 className="text-5xl font-bold space-font mb-2" style={{color: selectedPlanet.color}}>
                {selectedPlanet.name}
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed border-t border-white/10 pt-4 mt-2">
                {selectedPlanet.description}
            </p>
        </div>

        {/* Mission Control Cards */}
        {!showQuiz && (
           <div className="pointer-events-auto flex flex-col gap-4 max-w-md w-full">
              
              {/* Video Mission */}
              <div 
                 onClick={handleVideoClick}
                 className="group cursor-pointer bg-gradient-to-r from-orange-900/90 to-red-900/90 backdrop-blur border-2 border-orange-500/30 hover:border-orange-400 p-4 rounded-2xl transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              >
                  <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">📺</span>
                      <h3 className="text-orange-300 font-bold space-font text-sm uppercase tracking-wider">Transmissió Entrant</h3>
                  </div>
                  <p className="text-white font-medium text-lg mb-2">{selectedPlanet.videoText}</p>
                  <div className="text-xs text-orange-300 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      Veure vídeo a YouTube ➜
                  </div>
              </div>

              {/* Quiz Mission */}
              <div 
                 onClick={handleMissionClick}
                 className="group cursor-pointer bg-gradient-to-r from-indigo-900/90 to-blue-900/90 backdrop-blur border-2 border-indigo-500/30 hover:border-indigo-400 p-4 rounded-2xl transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                  <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">📝</span>
                      <h3 className="text-indigo-300 font-bold space-font text-sm uppercase tracking-wider">Repte de Cadet</h3>
                  </div>
                  <p className="text-white font-medium text-lg mb-2">{selectedPlanet.quizText}</p>
                  <div className="text-xs text-indigo-300 uppercase font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      {isExternalQuiz ? 'Obrir NotebookLM i Verificar' : 'Iniciar Test'} ➜
                  </div>
              </div>

           </div>
        )}
      </div>

      {/* Quiz Overlay (Centered) */}
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
                  <div className="h-1 w-32 bg-indigo-500 mx-auto rounded-full mb-8"></div>
                  
                  {isExternalQuiz && (
                    <div className="mb-8 bg-black/30 p-4 rounded-xl border border-indigo-400/30 flex items-center gap-4">
                       <div className="text-4xl">🤖</div>
                       <div>
                           <p className="text-sm text-indigo-200 mb-1">Pas 1: Missió Externa</p>
                           <p className="text-white font-bold">Ja has completat el test a la pestanya que s'ha obert?</p>
                           <a href={selectedPlanet.externalQuizUrl} target="_blank" rel="noreferrer" className="text-xs text-yellow-400 hover:underline mt-1 block">
                               (Obrir de nou si s'ha tancat)
                           </a>
                       </div>
                    </div>
                  )}

                  <div className="mb-8 text-center">
                      <p className="text-2xl font-bold text-white mb-2">
                          {selectedPlanet.quiz[quizIndex].text}
                      </p>
                  </div>

                  <div className="grid gap-3">
                      {selectedPlanet.quiz[quizIndex].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="bg-white/5 hover:bg-indigo-600 text-left px-6 py-4 rounded-xl border border-indigo-500/30 transition-all text-lg font-medium hover:scale-102 hover:shadow-lg hover:border-yellow-400 group"
                          >
                              <span className="inline-block w-8 font-bold text-indigo-400 group-hover:text-white">{String.fromCharCode(65 + idx)}.</span>
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
