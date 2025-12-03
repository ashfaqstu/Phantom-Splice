import React, { useState } from 'react';
import ThePortal from './components/ThePortal';
import SpiritResult from './components/SpiritResult';
import { RitualState, ProcessedImage, BackendConfig } from './types';
import { severSpirit } from './services/spiritService';

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

      setResult({
        originalUrl,
        processedUrl,
        spiritReading: "A mysterious presence emerges from the shadows..."
      });
      
      setState(RitualState.COMPLETE);
    } catch (error) {
      console.error(error);
      setState(RitualState.FAILED);
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
    <div className="min-h-screen w-full relative overflow-x-hidden pb-20" style={{ minHeight: '500px' }}>
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-purple"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* Header */}
        <header className="mb-12 text-center relative group">
          <h1 className="text-2xl font-cinzel font-black text-gradient-purple drop-shadow-lg">
            The Phantom Crop
          </h1>
          <p className="mt-4 text-purple-300/60 font-cinzel text-xs tracking-[0.2em] uppercase">
            Separate the Spirit from the Plane
          </p>
        </header>

        {/* Config Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={toggleMockMode}
            className={`text-xs px-3 py-1 rounded border transition-colors ${config.useMock ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-transparent border-purple-900 text-purple-800 hover:text-purple-500'}`}
          >
            {config.useMock ? "Mock" : "Live"}
          </button>
        </div>

        {/* Content */}
        <main className="w-full flex items-center justify-center" style={{ minHeight: '300px' }}>
          {state === RitualState.COMPLETE && result ? (
            <SpiritResult data={result} onReset={handleReset} />
          ) : (
            <ThePortal onFileSelected={handleFileSelected} state={state} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-purple-900/50 text-xs font-cinzel mt-12">
        <p>Chrome Extension • Phantom Crop</p>
      </footer>
    </div>
  );
};

export default App;
