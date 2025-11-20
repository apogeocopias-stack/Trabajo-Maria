import React, { useEffect, useState } from 'react';
import { AvatarConfig, QuizResult } from '../types';
import { generateOutroImage } from '../services/geminiService';

interface Props {
  config: AvatarConfig;
  results: QuizResult[];
  onRestart: () => void;
}

const SchoolEnding: React.FC<Props> = ({ config, results, onRestart }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.correct).length;

  useEffect(() => {
    const loadEnding = async () => {
      // Try to use cached/provided URL if we stored it in config, else generate
      if (config.outroImageUrl) {
          setImageUrl(config.outroImageUrl);
          setLoading(false);
          return;
      }

      try {
        const url = await generateOutroImage(config);
        setImageUrl(url);
      } catch (e) {
        console.error("Failed to generate outro", e);
      } finally {
        setLoading(false);
      }
    };
    loadEnding();
  }, [config]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-orange-400 to-blue-500 flex items-center justify-center p-8">
      <div className="bg-white/90 p-8 rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row gap-8 items-center">
        
        <div className="flex-1 text-center md:text-left">
           <h1 className="text-4xl font-bold text-indigo-900 mb-4 space-font">¡Misión Cumplida!</h1>
           <p className="text-gray-700 text-lg mb-6">
             El astronauta <strong>{config.name}</strong> ha vuelto sano y salvo al colegio Max Aub.
           </p>
           
           <div className="bg-indigo-100 p-6 rounded-2xl mb-6">
             <h2 className="text-2xl font-bold text-indigo-800 mb-2">Resultado de la Misión</h2>
             <div className="text-5xl font-bold text-green-600 mb-2">
               {correctAnswers} / {Math.max(results.length, 1)}
             </div>
             <p className="text-gray-600">Preguntas acertadas</p>
           </div>

           <button 
             onClick={onRestart}
             className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-transform hover:scale-105"
           >
             Empezar nueva aventura
           </button>
        </div>

        <div className="flex-1 w-full">
          <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative">
             {loading ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 flex-col">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    Generando foto de llegada...
                 </div>
             ) : imageUrl ? (
                 <img src={imageUrl} alt="School Ending" className="w-full h-full object-cover" />
             ) : (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
                    No se pudo cargar la foto.
                 </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchoolEnding;