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
    <div className="w-full flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden"
      />

      {/* The Portal Circle */}
      <div 
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`${circleBase} border-4 border-dashed ${borderColor} ${glowEffect} bg-black/40 backdrop-blur-sm`}
      >
        {/* Runes Ring (Decorative) */}
        <div className={`absolute inset-0 rounded-full border border-white/5 opacity-20 ${isProcessing ? 'animate-portal-spin' : ''}`}></div>
        
        {/* Fog Particles (CSS Only) */}
        {isSummoning && (
           <>
            <div className="absolute bottom-4 left-1/4 w-8 h-8 bg-green-500/20 rounded-full blur-xl animate-fog" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-4 right-1/4 w-12 h-12 bg-green-500/20 rounded-full blur-xl animate-fog" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-10 left-1/2 w-10 h-10 bg-green-500/10 rounded-full blur-xl animate-fog" style={{ animationDelay: '1.2s' }}></div>
           </>
        )}

        <div className="z-10 flex flex-col items-center text-center p-6 space-y-4 pointer-events-none">
           {isProcessing ? (
             <>
               <div className="mb-4">
                 {/* Spooky Spinner */}
                 <svg className="animate-spin h-16 w-16 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               </div>
               <h3 className="text-2xl font-cinzel text-purple-200 animate-pulse">Severing Spirit...</h3>
               <p className="text-sm text-purple-400/70">Do not break the circle</p>
             </>
           ) : (
             <>
                <div className={`transition-transform duration-300 ${isSummoning ? 'scale-125 rotate-12' : ''}`}>
                  {/* Scissors Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-20 h-20 ${iconColor}`}>
                    <path fillRule="evenodd" d="M2.614 4.54a1.5 1.5 0 0 1 2.053-.127l1.242 1.118 2.071-2.072a3.001 3.001 0 0 1 4.243 0L13.293 4.53l.93-.93a1.5 1.5 0 0 1 2.12 2.122l-.929.93 1.07 1.072a3.002 3.002 0 0 1 0 4.242l-2.07 2.072 1.117 1.242a1.5 1.5 0 1 1-2.222 1.998L12.19 16.16l-3.352 3.353a4.5 4.5 0 1 1-6.364-6.364l3.353-3.353L4.662 8.67a1.5 1.5 0 0 1-.122-2.053l-.004-.005 1.12-1.118-2.07-2.072a3.002 3.002 0 0 1 0-4.242l2.07-2.072L4.54 5.856a1.5 1.5 0 0 1-1.926-1.316ZM15.707 9.12l-1.414-1.414 1.414-1.415 1.414 1.415-1.414 1.414Zm-4.95-4.95 1.414 1.415-1.414 1.414-1.414-1.414 1.414-1.415ZM8.5 14.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-cinzel font-bold transition-colors ${textColor}`}>
                  {isSummoning ? "Release the Spirit" : "Summon Image"}
                </h3>
                <p className="text-purple-400/60 max-w-xs">
                  {isSummoning 
                    ? "Drop to sever the background..." 
                    : "Drag and drop your image here, or click to open the veil."}
                </p>
             </>
           )}
        </div>
      </div>
      
      {state === RitualState.FAILED && (
        <div className="mt-8 text-red-400 font-cinzel text-lg animate-pulse">
           The ritual failed. The spirits are restless.
        </div>

      </div>
    </div>
  );
};

export default ThePortal;
