import React, { useState, useEffect, useRef } from 'react';
import ThePortal from './components/ThePortal';
import SpiritResult from './components/SpiritResult';
import { RitualState, ProcessedImage, BackendConfig } from './types';
import { severSpirit, getSpiritReading } from './services/spiritService';

const App: React.FC = () => {
  const [state, setState] = useState<RitualState>(RitualState.IDLE);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [config, setConfig] = useState<BackendConfig>({
    useMock: true,
    serverUrl: 'http://localhost:5000/sever'
  });
  
  const handleFileSelected = async (file: File) => {
    setState(RitualState.SEVERING);
    
    try {
      const originalUrl = URL.createObjectURL(file);
      const blob = await severSpirit(file, config);
      const processedUrl = URL.createObjectURL(blob);

      // 2. Get Reading (Gemini)
      // We don't block the UI if this fails or takes too long, run in parallel but await for result display
      const readingPromise = getSpiritReading(file);
      
      const reading = await readingPromise;

      setResult({
        originalUrl,
        processedUrl,
        spiritReading: "A mysterious presence emerges from the shadows..."
      });
      
      setState(RitualState.COMPLETE);

    } catch (error) {
      console.error(error);
      setState(RitualState.FAILED);
      soundService.playFailure();
      setTimeout(() => setState(RitualState.IDLE), 3000);
    }
  };

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result.originalUrl);
      if (result.processedUrl) URL.revokeObjectURL(result.processedUrl);
    }
    setResult(null);
    setState(RitualState.IDLE);
  };

  const toggleMockMode = () => {
    setConfig(prev => ({ ...prev, useMock: !prev.useMock }));
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden selection:bg-purple-500 selection:text-white pb-20">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0518] via-[#1a0b2e] to-[#0f0518]"></div>
        {/* Radial gradient glow from bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* --- MAIN UI --- */}
      <div className="relative z-20 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <header className="mb-12 text-center relative group">
          <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-200 to-purple-600 drop-shadow-lg">
            The Phantom Crop
          </h1>
          <p className="mt-4 text-purple-300/60 font-cinzel text-sm tracking-[0.2em] uppercase">
            Separate the Spirit from the Plane
          </p>
        </header>

        {/* Configuration Toggle (Subtle) */}
        <div className="absolute top-4 right-4 z-50">
           <button 
             onClick={toggleMockMode}
             className={`text-xs px-3 py-1 rounded border transition-colors ${config.useMock ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-transparent border-purple-900 text-purple-800 hover:text-purple-500'}`}
           >
             {config.useMock ? "Simulation Mode (Active)" : "Live Backend Mode"}
           </button>
        </div>

        {/* Content Area */}
        <main className="w-full max-w-4xl min-h-[500px] flex items-center justify-center">
          
          {state === RitualState.COMPLETE && result ? (
            <SpiritResult data={result} onReset={handleReset} />
          ) : (
            <ThePortal onFileSelected={handleFileSelected} state={state} />
          )}
        </main>
      </div>

      {/* Footer / Instructions */}
      <footer className="relative z-10 text-center text-purple-900/50 text-xs font-cinzel mt-12">
        <p>Uses Dark Magick (Python rembg) & Gemini Oracle</p>
      </footer>
    </div>
  );
};

export default App;
