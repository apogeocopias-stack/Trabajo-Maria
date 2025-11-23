import React, { useState } from 'react';
import { AppPhase, AvatarConfig, QuizResult } from './types';
import AvatarCreator from './components/AvatarCreator';
import SolarSystem from './components/SolarSystem';
import PlanetOverlay from './components/PlanetOverlay';
import SchoolEnding from './components/SchoolEnding';
import Academy from './components/Academy';

const STORAGE_KEY = 'max_aub_avatar_config';

const App: React.FC = () => {
  // Initialize avatarConfig from localStorage if available
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to load avatar config", e);
      return null;
    }
  });

  // Always start at AVATAR_CREATION for the presentation flow
  const [phase, setPhase] = useState<AppPhase>(AppPhase.AVATAR_CREATION);

  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  
  const handleAvatarComplete = (config: AvatarConfig, skipAcademy: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save to localStorage (likely quota exceeded)", e);
    }
    setAvatarConfig(config);
    
    if (skipAcademy) {
        setPhase(AppPhase.SOLAR_SYSTEM);
    } else {
        setPhase(AppPhase.ACADEMY);
    }
  };

  const handleAcademyComplete = () => {
      setPhase(AppPhase.SOLAR_SYSTEM);
  };

  const handleQuizUpdate = (newResults: QuizResult[]) => {
    setQuizResults(newResults);
  };

  const handleFinishJourney = () => {
    setPhase(AppPhase.OUTRO);
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error removing storage", e);
    }
    setAvatarConfig(null);
    setQuizResults([]);
    setSelectedPlanetId(null);
    setPhase(AppPhase.AVATAR_CREATION);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      
      {phase === AppPhase.AVATAR_CREATION && (
        <AvatarCreator onComplete={handleAvatarComplete} />
      )}

      {phase === AppPhase.ACADEMY && avatarConfig && (
          <Academy 
            pilotName={avatarConfig.name} 
            onComplete={handleAcademyComplete} 
          />
      )}

      {phase === AppPhase.SOLAR_SYSTEM && (
        <>
          <SolarSystem 
            selectedPlanetId={selectedPlanetId} 
            onPlanetSelect={setSelectedPlanetId}
          />
          <PlanetOverlay 
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={setSelectedPlanetId}
            onQuizComplete={handleQuizUpdate}
            onFinishJourney={handleFinishJourney}
            avatarUrl={avatarConfig?.imageUrl}
            pilotName={avatarConfig?.name}
          />
        </>
      )}

      {phase === AppPhase.OUTRO && avatarConfig && (
        <SchoolEnding 
          config={avatarConfig} 
          results={quizResults} 
          onRestart={handleRestart}
        />
      )}

    </div>
  );
};

export default App;