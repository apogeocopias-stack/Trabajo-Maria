
import React, { useState } from 'react';
import { AvatarConfig } from '../types';
import { generateAvatarImage } from '../services/geminiService';

interface Props {
  onComplete: (config: AvatarConfig) => void;
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

  const handleStartMission = () => {
    if (generatedImage) {
      onComplete({ ...formData, imageUrl: generatedImage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-yellow-300 space-font">
          Missió Espacial: Max Aub
        </h1>
        <p className="text-center text-indigo-200 mb-8 text-xl">
          Configura el teu astronauta
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-indigo-100 mb-1">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="El teu nom"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-indigo-100 mb-1">Gènere</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as 'nen'|'nena'})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                >
                  <option value="nena">Nena</option>
                  <option value="nen">Nen</option>
                </select>
              </div>
              <div>
                <label className="block text-indigo-100 mb-1">Alçada</label>
                <select
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                >
                  <option value="alta">Alta</option>
                  <option value="mitjana">Mitjana</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-indigo-100 mb-1">Color de cabell</label>
                <select
                  value={formData.hairColor}
                  onChange={(e) => setFormData({...formData, hairColor: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
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
                <label className="block text-indigo-100 mb-1">Tipus de cabell</label>
                <select
                  value={formData.hairType}
                  onChange={(e) => setFormData({...formData, hairType: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
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
            <div className="w-64 h-64 bg-black/30 rounded-full border-4 border-indigo-500/30 flex items-center justify-center overflow-hidden relative shadow-[0_0_50px_rgba(79,70,229,0.3)]">
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
              <button
                onClick={handleStartMission}
                className="mt-8 w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-green-500/20 animate-bounce"
              >
                Enlairament a l'Espai! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;