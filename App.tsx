import React, { useState, useEffect, useRef } from 'react';
import ThePortal from './components/ThePortal';
import SpiritResult from './components/SpiritResult';
import { RitualState, ProcessedImage, BackendConfig } from './types';
import { severSpirit, getSpiritReading } from './services/spiritService';
import { soundService } from './services/soundService';

const Oscilloscope = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    let t = 0;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 0, 0, 0.1)'; // Slow fade trail
      ctx.fillRect(0, 0, width, height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ff0000';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff0000';
      
      ctx.beginPath();
      
      const centerY = height / 2;
      const amplitude = 50;
      
      // Draw a "heartbeat" / glitch line
      for (let x = 0; x < width; x+=5) {
        // Random glitch spikes
        const glitch = Math.random() > 0.98 ? (Math.random() - 0.5) * 300 : 0;
        
        // Sine wave base
        const y = centerY + Math.sin(x * 0.01 + t) * amplitude 
                  + (Math.random() - 0.5) * 10 // constant noise
                  + glitch;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      t += 0.1;
      requestAnimationFrame(draw);
    };
    
    const animId = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-30 pointer-events-none" />;
};

const BloodRain = () => {
  // Create an array of random drips
  const drips = Array.from({ length: 20 }).map((_, i) => ({
    left: `${Math.random() * 100}vw`,
    delay: `${Math.random() * 5}s`,
    duration: `${1 + Math.random() * 2}s`
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[2]">
      {drips.map((drip, i) => (
        <div 
          key={i} 
          className="blood-drip"
          style={{ 
            left: drip.left, 
            animationDelay: drip.delay,
            animationDuration: drip.duration
          }}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<RitualState>(RitualState.IDLE);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [config, setConfig] = useState<BackendConfig>({
    useMock: false,
    serverUrl: 'http://localhost:5000/sever'
  });
  
  const handleFileSelected = async (file: File) => {
    setState(RitualState.SEVERING);
    
    try {
      const originalUrl = URL.createObjectURL(file);
      const blob = await severSpirit(file, config);
      const processedUrl = URL.createObjectURL(blob);
      
      // Start reading concurrently
      const readingPromise = getSpiritReading(file);
      const reading = await readingPromise;

      setResult({
        originalUrl,
        processedUrl,
        spiritReading: reading
      });
      
      setState(RitualState.COMPLETE);
      soundService.playSuccess();

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
    <div className="min-h-screen w-full relative overflow-hidden selection:bg-red-600 selection:text-white pb-20 bg-[#050000]">
      
      {/* --- BACKGROUND LAYERS --- */}
      <Oscilloscope />
      <BloodRain />
      
      {/* Visceral Vignette */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_80%,#000_100%)]"></div>

      {/* CRT Scanlines (Scrolls) */}
      <div className="scanlines"></div>
      
      {/* Noise Grain */}
      <div className="noise"></div>

      {/* --- MAIN UI --- */}
      <div className="relative z-20 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        
        {/* Header with Glitch Effect */}
        <header className="mb-12 mt-4 text-center relative group select-none">
          <div className="relative inline-block">
            <h1 
              className="text-5xl md:text-7xl font-cinzel font-black tracking-tighter text-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] glitch"
              data-text="PHANTOM CROP"
            >
              PHANTOM CROP
            </h1>
          </div>
          
          <div className="mt-4 flex flex-col items-center space-y-2">
             <div className="h-[1px] w-full max-w-[200px] bg-red-800 animate-pulse"></div>
             <p className="font-mono-tech text-red-600 text-sm tracking-[0.4em] uppercase animate-pulse">
               SYSTEM FAILURE: DETECTED
             </p>
          </div>
        </header>

        {/* Configuration Toggle (Cyber Style) */}
        <div className="absolute top-6 right-6 z-50 flex gap-4">
           <button
             onClick={() => soundService.toggleMute()}
             className="font-mono-tech text-xs px-4 py-2 border border-red-900/60 bg-black/60 text-red-600 hover:text-red-400 backdrop-blur-sm"
           >
             MUTE
           </button>

           <button 
             onClick={toggleMockMode}
             className={`
               font-mono-tech text-xs px-4 py-2 border backdrop-blur-sm transition-all duration-100 clip-path-polygon
               ${config.useMock 
                 ? 'bg-orange-950/40 border-orange-600 text-orange-500 hover:bg-orange-900/60' 
                 : 'bg-red-950/40 border-red-600 text-red-500 hover:bg-red-900/60'
               }
             `}
             style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
           >
             {config.useMock ? "SIMULATION MODE" : "LIVE CONNECTION"}
           </button>
        </div>

        {/* Content Area */}
        <main className="flex-grow w-full flex items-center justify-center">
          
          {state === RitualState.COMPLETE && result ? (
            <SpiritResult data={result} onReset={handleReset} />
          ) : (
            <ThePortal 
              onFileSelected={handleFileSelected} 
              state={state} 
            />
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 right-0 text-center z-20 pointer-events-none">
        <p className="text-red-900/60 text-[10px] font-mono-tech tracking-widest uppercase">
          Awaiting Biological Input...
        </p>
      </footer>

    </div>
  );
};

export default App;