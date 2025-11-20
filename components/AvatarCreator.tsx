import React, { useState } from 'react';
import { AvatarConfig } from '../types';
import { generateAvatarImage } from '../services/geminiService';

interface Props {
  onComplete: (config: AvatarConfig) => void;
}

const AvatarCreator: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState<AvatarConfig>({
    name: '',
    gender: 'niña',
    height: 'media',
    hairColor: 'castaño',
    hairType: 'liso'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!formData.name) {
      setError("¡Por favor escribe un nombre!");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateAvatarImage(formData);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError("No se pudo generar la imagen. Inténtalo de nuevo.");
      }
    } catch (e) {
      setError("Hubo un error conectando con Nano Banana. Verifica tu API Key.");
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
          Misión Espacial: Max Aub
        </h1>
        <p className="text-center text-indigo-200 mb-8 text-xl">
          Configura tu astronauta
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-indigo-100 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Tu nombre"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-indigo-100 mb-1">Género</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as 'niño'|'niña'})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                >
                  <option value="niña">Niña</option>
                  <option value="niño">Niño</option>
                </select>
              </div>
              <div>
                <label className="block text-indigo-100 mb-1">Altura</label>
                <select
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-indigo-100 mb-1">Color de pelo</label>
                <select
                  value={formData.hairColor}
                  onChange={(e) => setFormData({...formData, hairColor: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                >
                  <option value="rubio">Rubio</option>
                  <option value="castaño">Castaño</option>
                  <option value="negro">Negro</option>
                  <option value="pelirrojo">Pelirrojo</option>
                  <option value="azul fantasía">Azul</option>
                  <option value="rosa fantasía">Rosa</option>
                </select>
              </div>
              <div>
                <label className="block text-indigo-100 mb-1">Tipo de pelo</label>
                <select
                  value={formData.hairType}
                  onChange={(e) => setFormData({...formData, hairType: e.target.value})}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl px-4 py-2 text-white"
                >
                  <option value="liso">Liso</option>
                  <option value="rizado">Rizado</option>
                  <option value="ondulado">Ondulado</option>
                  <option value="corto">Corto</option>
                  <option value="coletas">Coletas</option>
                </select>
              </div>
            </div>

            {!generatedImage && (
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-bold py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-orange-500/20"
              >
                {isLoading ? 'Generando con Nano Banana...' : 'Crear Avatar'}
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
                  Tu avatar aparecerá aquí
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
                ¡Despegar al Espacio! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;