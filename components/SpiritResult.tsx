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
      link.download = 'phantom_severed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-8 animate-[fadeIn_1s_ease-out]">
      
      {/* Result Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Source Card */}
        <div className="relative group border border-red-900/30 bg-black p-1">
           <div className="absolute top-0 left-0 px-2 py-1 bg-red-900/20 text-red-600 font-mono-tech text-xs tracking-widest z-10 border-r border-b border-red-900/30">
             SUBJECT_01 (INPUT)
           </div>
           
           <div className="relative aspect-square w-full flex items-center justify-center bg-[#0a0000] overflow-hidden">
             <img 
               src={data.originalUrl} 
               alt="Original" 
               className="max-w-full max-h-full object-contain opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
             />
             {/* Scanline overlay specific to image */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,0,0,0.02),rgba(0,0,0,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
           </div>
        </div>

        {/* Result Card */}
        <div className="relative group border border-red-600/50 bg-black p-1 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
           <div className="absolute top-0 left-0 px-2 py-1 bg-red-600 text-black font-mono-tech text-xs font-bold tracking-widest z-10">
             RESULT (SEVERED)
           </div>
           
           <div className="relative aspect-square w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,#1a0000_0%,#000_100%)] overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{ 
                 backgroundImage: 'linear-gradient(45deg, #300 25%, transparent 25%), linear-gradient(-45deg, #300 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #300 75%), linear-gradient(-45deg, transparent 75%, #300 75%)',
                 backgroundSize: '20px 20px'
             }}></div>

             {data.processedUrl && (
               <img 
                 src={data.processedUrl} 
                 alt="Processed" 
                 className="relative z-10 max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]" 
               />
             )}
           </div>
        </div>

      </div>

      {/* Analysis Log */}
      {data.spiritReading && (
         <div className="border border-red-900/40 bg-black/80 p-6 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
           <h4 className="font-mono-tech text-red-500 text-xs mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             NECROPSY REPORT
           </h4>
           <p className="font-cinzel text-lg text-gray-300 italic leading-relaxed">
             "{data.spiritReading}"
           </p>
         </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-4">
        <button 
          onClick={onReset}
          className="font-mono-tech text-red-800 hover:text-red-500 tracking-widest text-sm py-3 px-6 border border-transparent hover:border-red-900/50 transition-all"
        >
          [ DISCARD ]
        </button>

        <button 
          onClick={handleDownload}
          className="relative group bg-red-900/20 hover:bg-red-600/20 border border-red-600 text-red-500 hover:text-red-100 font-mono-tech tracking-widest py-3 px-8 transition-all overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            EXTRACT_FILE <span className="text-xs">▼</span>
          </span>
          <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-20"></div>
        </button>
      </div>

    </div>
  );
};

export default SpiritResult;