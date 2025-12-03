import React, { useCallback, useState, useRef } from 'react';
import { RitualState } from '../types';

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
      setIsDragOver(true);
    }
  }, [state]);

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
        onFileSelected(file);
      } else {
        alert("Only images can be offered to the portal.");
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
      onFileSelected(e.target.files[0]);
    }
  };

  const isSummoning = isDragOver;
  const isProcessing = state === RitualState.SEVERING;
  
  let borderColor = "border-purple-800";
  let glowClass = "";
  let iconColor = "text-purple-400";
  let textColor = "text-purple-300";

  if (isSummoning) {
    borderColor = "border-green-400";
    glowClass = "animate-ectoplasm scale-105";
    iconColor = "text-green-400";
    textColor = "text-green-300";
  } else if (isProcessing) {
    borderColor = "border-red-900";
    glowClass = "animate-pulse shadow-glow-red";
    iconColor = "text-red-500";
    textColor = "text-red-400";
  }

  return (
    <div className="w-full flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden"
      />

      <div 
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer group border-4 border-dashed ${borderColor} ${glowClass} bg-black/40 backdrop-blur-sm`}
      >
        <div className={`absolute inset-0 rounded-full border border-white/5 opacity-20 ${isProcessing ? 'animate-portal-spin' : ''}`}></div>
        
        {isSummoning && (
          <>
            <div className="absolute bottom-4 left-1/4 w-8 h-8 bg-green-500/20 rounded-full blur-xl animate-fog" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-4 right-1/4 w-12 h-12 bg-green-500/20 rounded-full blur-xl animate-fog" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}

        <div className="z-10 flex flex-col items-center text-center p-6 space-y-4 pointer-events-none">
          {isProcessing ? (
            <>
              <svg className="animate-spin h-16 w-16 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-lg font-cinzel text-purple-200 animate-pulse">Severing...</h3>
            </>
          ) : (
            <>
              <div className={`transition-transform duration-300 ${isSummoning ? 'scale-125 rotate-12' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-16 h-16 ${iconColor}`}>
                  <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                  <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={`text-lg font-cinzel font-bold transition-colors ${textColor}`}>
                {isSummoning ? "Release!" : "Summon Image"}
              </h3>
              <p className="text-purple-400/60 text-xs max-w-xs">
                {isSummoning ? "Drop to sever..." : "Drop or click"}
              </p>
            </>
          )}
        </div>
      </div>
      
      {state === RitualState.FAILED && (
        <div className="mt-8 text-red-400 font-cinzel text-lg animate-pulse">
          The ritual failed.
        </div>
      )}
    </div>
  );
};

export default ThePortal;
