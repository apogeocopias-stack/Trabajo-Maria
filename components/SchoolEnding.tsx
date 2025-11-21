
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
    <div className="min-h-screen bg-gradient-to-t from-orange-400 to-blue-500 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 p-6 md:p-8 rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center">
        
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
           <h1 className="text-4xl font-bold text-indigo-900 mb-4 space-font">Missió Complerta!</h1>
           <p className="text-gray-700 text-lg mb-6">
             L'astronauta <strong>{config.name}</strong> ha aterrat amb èxit i torna a casa amb moltes històries per explicar.
           </p>
           
           <div className="bg-indigo-100 p-6 rounded-2xl mb-6 shadow-inner">
             <h2 className="text-2xl font-bold text-indigo-800 mb-2">Resultat de la Missió</h2>
             <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-5xl font-bold text-green-600">
                  {correctAnswers} / {Math.max(results.length, 1)}
                </span>
                <span className="text-4xl">⭐</span>
             </div>
             <p className="text-gray-600 mt-2">Preguntes encertades</p>
           </div>

           <button 
             onClick={onRestart}
             className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 shadow-lg transition-transform hover:scale-105 w-full md:w-auto"
           >
             Començar nova aventura 🚀
           </button>
        </div>

        <div className="flex-1 w-full order-1 md:order-2">
          <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden border-4 border-white shadow-2xl relative group">
             
             {loading ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 flex-col">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                    <p className="animate-pulse font-bold">Preparant la rebuda al cole...</p>
                 </div>
             ) : imageUrl ? (
                 <>
                    <img src={imageUrl} alt="School Ending" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    {/* Bottom gradient for better text visibility if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                 </>
             ) : (
                // Fallback if image fails completely - Show Avatar
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900 text-white p-4">
                    <div className="text-6xl mb-4">🏫</div>
                    <p className="text-center font-bold text-xl">Benvingut al Col·legi Max Aub!</p>
                    {config.imageUrl && (
                        <img src={config.imageUrl} alt="Avatar fallback" className="w-32 h-32 rounded-full border-4 border-white mt-4 shadow-lg" />
                    )}
                 </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchoolEnding;
