import React, { useCallback, useState, useRef } from 'react';
import { RitualState } from '../types';
import { soundService } from '../services/soundService';

interface ThePortalProps {
  onFileSelected: (file: File) => void;
  state: RitualState;
}

const ThePortal: React.FC<ThePortalProps> = ({ onFileSelected, state }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === RitualState.IDLE || state === RitualState.FAILED) {
      if (!isDragOver) {
        soundService.playDragHover();
      }
      setIsDragOver(true);
    }
  }, [state, isDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (state !== RitualState.IDLE && state !== RitualState.FAILED) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        soundService.playDrop();
        onFileSelected(file);
      } else {
        soundService.playFailure();
      }
    }
  }, [onFileSelected, state]);

  const handleClick = () => {
    if (state === RitualState.IDLE || state === RitualState.FAILED) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      soundService.playDrop();
      onFileSelected(e.target.files[0]);
    }
  };

  const isSummoning = isDragOver;
  const isProcessing = state === RitualState.SEVERING;
  
  // Dynamic Styles
  const pulseSpeed = isSummoning || isProcessing ? 'duration-150' : 'duration-[2000ms]';
  const scale = isSummoning ? 'scale-110' : 'scale-100';
  
  // Heartbeat animation via inline style for variability
  const heartbeatStyle = (isSummoning || isProcessing) 
    ? { animation: 'blob-pulse 0.4s ease-in-out infinite alternate' } 
    : { animation: 'blob-pulse 3s ease-in-out infinite alternate' };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[500px]">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden"
      />

      {/* Main Wound/Portal Container */}
      <div 
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative w-[320px] h-[320px] md:w-[480px] md:h-[480px]
          flex items-center justify-center cursor-pointer
          transition-all ease-out
          ${scale}
        `}
      >
        {/* 1. The Outer Glow / Bruise */}
        <div 
           className="absolute inset-0 bg-red-900/20 blur-[60px] rounded-full transition-opacity duration-300"
           style={{ opacity: isSummoning ? 0.8 : 0.3 }}
        ></div>

        {/* 2. The Writhing Wound (Organic Blob) */}
        <div 
          className={`
            absolute inset-0 border-4 mix-blend-screen
            transition-colors duration-300
            ${isSummoning ? 'border-red-500 bg-red-900/20' : 'border-red-900/40 bg-black/40'}
            ${isProcessing ? 'border-red-400 bg-red-950/80' : ''}
          `}
          style={{
             boxShadow: isSummoning ? '0 0 50px rgba(255,0,0,0.5), inset 0 0 30px rgba(255,0,0,0.3)' : '0 0 20px rgba(50,0,0,0.5)',
             ...heartbeatStyle
          }}
        ></div>

        {/* 3. Inner Vortex Layers (Rotating) */}
        <div className={`absolute inset-6 opacity-60 rounded-full border border-dashed border-red-800/50 animate-spin-slow duration-[10s]`}></div>
        <div className={`absolute inset-12 opacity-40 rounded-full border-2 border-dotted border-red-700/50 animate-spin-reverse duration-[15s]`}></div>
        
        {/* 4. The Void Center */}
        <div 
           className={`
             absolute w-40 h-40 rounded-full bg-black shadow-[inset_0_0_40px_rgba(0,0,0,1)]
             flex items-center justify-center transition-all duration-300
             ${isSummoning ? 'scale-125 shadow-[inset_0_0_20px_rgba(255,0,0,0.5)]' : 'scale-100'}
           `}
        >
          {isProcessing ? (
             <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 border-t-4 border-red-600 rounded-full animate-spin"></div>
                <span className="font-mono-tech text-red-500 animate-pulse text-xs tracking-widest">SEVERING</span>
             </div>
          ) : (
            <div className={`transition-all duration-300 ${isSummoning ? 'text-red-500 scale-110' : 'text-red-900'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                 <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
               </svg>
            </div>
          )}
        </div>

        {/* 5. Text Overlay - Float underneath */}
        <div className="absolute -bottom-24 text-center pointer-events-none">
          <h2 className={`text-2xl font-cinzel font-bold tracking-[0.2em] transition-colors duration-300 ${isSummoning ? 'text-red-500' : 'text-red-900/70'}`}>
            {isSummoning ? "INSERT FLESH" : "OPEN THE WOUND"}
          </h2>
          <p className="font-mono-tech text-[10px] text-red-900/50 mt-1 uppercase">
            {isSummoning ? "RELEASE TO CONSUME" : "CLICK OR DRAG"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ThePortal;