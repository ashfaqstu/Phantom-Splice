import React from 'react';
import { ProcessedImage } from '../types';

interface SpiritResultProps {
  data: ProcessedImage;
  onReset: () => void;
}

const SpiritResult: React.FC<SpiritResultProps> = ({ data, onReset }) => {
  const handleDownload = () => {
    if (data.processedUrl) {
      const link = document.createElement('a');
      link.href = data.processedUrl;
      link.download = 'severed_spirit.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full p-4 animate-fadeIn">
      <div className="grid grid-cols-2 gap-4 items-start">
        
        {/* Original */}
        <div className="glass-panel p-2 rounded-xl flex flex-col items-center">
          <h3 className="text-sm font-cinzel text-purple-300 mb-2 border-b border-purple-800 pb-2 w-full text-center">Original</h3>
          <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden border border-purple-900/50 group">
            <img 
              src={data.originalUrl} 
              alt="Original" 
              className="w-full h-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500" 
            />
            <div className="absolute inset-0 pointer-events-none shadow-inset-dark"></div>
          </div>
        </div>

        {/* Result */}
        <div className="glass-panel p-2 rounded-xl flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 checkerboard"></div>
          <h3 className="text-sm font-cinzel text-green-400 mb-2 border-b border-green-900 pb-2 w-full text-center relative z-10">
            Severed
          </h3>
          <div className="relative w-full aspect-square flex items-center justify-center rounded-lg overflow-hidden border border-green-900/30 z-10">
            {data.processedUrl ? (
              <img 
                src={data.processedUrl} 
                alt="Processed" 
                className="w-full h-full object-contain" 
              />
            ) : (
              <div className="text-purple-500 font-cinzel text-sm">Missing</div>
            )}
          </div>
        </div>
      </div>

      {/* Reading */}
      {data.spiritReading && (
        <div className="mt-4 glass-panel p-4 rounded-xl border-l-4 border-purple-500">
          <p className="font-serif italic text-sm text-purple-100/80 leading-relaxed">
            "{data.spiritReading}"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-6">
        <button 
          onClick={onReset}
          className="px-4 py-2 rounded-full font-cinzel text-sm text-purple-300 border border-purple-700 hover:bg-purple-900/30 transition-all duration-300"
        >
          Again
        </button>
        <button 
          onClick={handleDownload}
          className="px-4 py-2 rounded-full font-cinzel text-sm font-bold text-black bg-gradient-green shadow-glow-green transition-all duration-300 hover:scale-105"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default SpiritResult;
