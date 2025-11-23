import React, { useState, useEffect } from 'react';
import { AvatarConfig } from '../types';
import { generateAvatarImage } from '../services/geminiService';

interface Props {
  onComplete: (config: AvatarConfig, skipAcademy: boolean) => void;
}

const AvatarCreator: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState<AvatarConfig>({
    name: '',
    gender: 'nena',
    height: 'mitjana',
    hairColor: 'castany',
    hairType: 'llis'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleGenerate = async () => {
    if (!formData.name) {
      setError("Si us plau, escriu un nom!");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateAvatarImage(formData);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError("No s'ha pogut generar la imatge. Torna-ho a provar.");
      }
    } catch (e) {
      setError("Hi ha hagut un error connectant amb la IA. Verifica la teva clau API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAcademy = () => {
    if (generatedImage) {
      onComplete({ ...formData, imageUrl: generatedImage }, false);
    }
  };

  const handleStartDirect = () => {
    if (generatedImage) {
        onComplete({ ...formData, imageUrl: generatedImage }, true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-4 relative overflow-y-auto">
      
      {/* Fullscreen Toggle Button */}
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 md:p-3 rounded-full border border-white/20 shadow-lg transition-all z-50"
        title={isFullscreen ? "Sortir de pantalla completa" : "Pantalla completa"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        )}
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 w-full max-w-2xl border border-white/20 shadow-2xl my-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-yellow-300 space-font">
          Missió Espacial: Max Aub
        </h1>
        <p className="text-center text-indigo-200 mb-6 md:mb-8 text-lg md:text-xl">
          Configura el teu astronauta
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-indigo-100 mb-1 text-sm md:text-base">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="El teu nom"
                disabled={!!generatedImage}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-indigo-100 mb-1 text-sm md:text-base">Gènere</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as 'nen'|'nena'})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                  disabled={!!generatedImage}
                >
                  <option value="nena">Nena</option>
                  <option value="nen">Nen</option>
                </select>
              </div>
              <div>
                <label className="block text-indigo-100 mb-1 text-sm md:text-base">Alçada</label>
                <select
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                  disabled={!!generatedImage}
                >
                  <option value="alta">Alta</option>
                  <option value="mitjana">Mitjana</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-indigo-100 mb-1 text-sm md:text-base">Color</label>
                <select
                  value={formData.hairColor}
                  onChange={(e) => setFormData({...formData, hairColor: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white text-sm"
                  disabled={!!generatedImage}
                >
                  <option value="ros">Ros</option>
                  <option value="castany">Castany</option>
                  <option value="negre">Negre</option>
                  <option value="pèl-roig">Pèl-roig</option>
                  <option value="blau fantasia">Blau</option>
                  <option value="rosa fantasia">Rosa</option>
                </select>
              </div>
              <div>
                <label className="block text-indigo-100 mb-1 text-sm md:text-base">Cabell</label>
                <select
                  value={formData.hairType}
                  onChange={(e) => setFormData({...formData, hairType: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white text-sm"
                  disabled={!!generatedImage}
                >
                  <option value="llis">Llis</option>
                  <option value="arrissat">Arrissat</option>
                  <option value="ondulat">Ondulat</option>
                  <option value="curt">Curt</option>
                  <option value="cues">Cues</option>
                </select>
              </div>
            </div>

            {!generatedImage && (
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-bold py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-orange-500/20"
              >
                {isLoading ? 'Generant amb Nano Banana...' : 'Crear Avatar'}
              </button>
            )}
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-black/30 rounded-full border-4 border-indigo-500/30 flex items-center justify-center overflow-hidden relative shadow-[0_0_50px_rgba(79,70,229,0.3)]">
              {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
              ) : generatedImage ? (
                <img src={generatedImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-indigo-300 text-center p-4">
                  <span className="text-4xl block mb-2">👩‍🚀</span>
                  El teu avatar apareixerà aquí
                </div>
              )}
            </div>
            
            {error && (
              <p className="text-red-400 mt-4 text-sm text-center bg-red-900/20 p-2 rounded">
                {error}
              </p>
            )}

            {generatedImage && (
              <div className="mt-8 w-full space-y-3 animate-fade-in">
                <p className="text-center text-indigo-200 text-sm mb-2 font-bold">Com vols començar?</p>
                
                <button
                  onClick={handleStartAcademy}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 md:py-3 rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <span>🎓</span> Sóc Cadet: Entrenament
                </button>

                <button
                  onClick={handleStartDirect}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-2 md:py-3 rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <span>🚀</span> Sóc Comandant: Enlairament!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;