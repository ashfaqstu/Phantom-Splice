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
    <div className="w-full max-w-5xl mx-auto p-4 animate-[fadeIn_1s_ease-out]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* The Mortal Plane (Original) */}
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center">
          <h3 className="text-xl font-cinzel text-purple-300 mb-4 border-b border-purple-800 pb-2 w-full text-center">The Mortal Plane</h3>
          <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden border border-purple-900/50 group">
             <img 
               src={data.originalUrl} 
               alt="Original" 
               className="w-full h-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500" 
             />
             <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"></div>
          </div>
        </div>

        {/* The Severed Spirit (Result) */}
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center relative overflow-hidden">
          {/* Subtle bg effect for transparency indication */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}></div>

          <h3 className="text-xl font-cinzel text-green-400 mb-4 border-b border-green-900 pb-2 w-full text-center drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
            The Severed Spirit
          </h3>
          
          <div className="relative w-full aspect-square flex items-center justify-center rounded-lg overflow-hidden border border-green-900/30 z-10">
            {data.processedUrl ? (
              <img 
                src={data.processedUrl} 
                alt="Processed" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] animate-[pulse_4s_ease-in-out_infinite]" 
              />
            ) : (
              <div className="text-purple-500 font-cinzel">Spirit Missing</div>
            )}
          </div>
        </div>

      </div>

      {/* Spirit Reading Section */}
      {data.spiritReading && (
         <div className="mt-8 glass-panel p-6 rounded-xl border-l-4 border-purple-500">
           <h4 className="text-lg font-cinzel text-purple-300 mb-2">Medium's Reading</h4>
           <p className="font-serif italic text-lg text-purple-100/80 leading-relaxed">
             "{data.spiritReading}"
           </p>
         </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
        <button 
          onClick={onReset}
          className="px-8 py-3 rounded-full font-cinzel text-purple-300 border border-purple-700 hover:bg-purple-900/30 transition-all duration-300"
        >
          Cast Another Spell
        </button>
        <button 
          onClick={handleDownload}
          className="px-8 py-3 rounded-full font-cinzel font-bold text-black bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all duration-300 transform hover:scale-105"
        >
          Capture Spirit (Download)
        </button>
      </div>
    </div>
  );
};

export default SpiritResult;