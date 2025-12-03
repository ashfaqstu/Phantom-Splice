class SoundService {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.25; // Keep volume reasonable
      this.masterGain.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') {
      this.context.resume().catch(e => console.error("Audio resume failed", e));
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.context?.currentTime || 0);
    }
  }

  // Effect: Low, airy swell when dragging starts
  playDragHover() {
    this.init();
    if (!this.context || !this.masterGain || this.isMuted) return;
    const t = this.context.currentTime;

    // 1. Low Drone
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 1.5);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.5);
    gain.gain.linearRampToValueAtTime(0, t + 2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 2);

    // 2. Pink Noise "Breath" (Approximated with modulated oscillator)
    const noiseOsc = this.context.createOscillator();
    const noiseGain = this.context.createGain();
    noiseOsc.type = 'triangle';
    noiseOsc.frequency.setValueAtTime(20, t); // Low rumble
    
    // Tremolo effect to simulate texture
    const lfo = this.context.createOscillator();
    lfo.frequency.value = 15;
    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 500;
    lfo.connect(lfoGain);
    lfoGain.connect(noiseOsc.frequency);
    lfo.start(t);
    lfo.stop(t + 2);

    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.1, t + 0.5);
    noiseGain.gain.linearRampToValueAtTime(0, t + 2);

    noiseOsc.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseOsc.start(t);
    noiseOsc.stop(t + 2);
  }

  // Effect: Heavy "Thud" / Seal Breaking
  playDrop() {
    this.init();
    if (!this.context || !this.masterGain || this.isMuted) return;
    const t = this.context.currentTime;

    // 1. The Impact (Kick-like)
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);

    gain.gain.setValueAtTime(1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.5);

    // 2. The "Splatter" (High noise burst)
    const splatOsc = this.context.createOscillator();
    const splatGain = this.context.createGain();
    splatOsc.type = 'sawtooth';
    splatOsc.frequency.setValueAtTime(100, t);
    splatOsc.frequency.linearRampToValueAtTime(20, t + 0.3);
    
    splatGain.gain.setValueAtTime(0.3, t);
    splatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    splatOsc.connect(splatGain);
    splatGain.connect(this.masterGain);
    splatOsc.start(t);
    splatOsc.stop(t + 0.3);
  }

  // Effect: Ethereal "Success" Chimes
  playSuccess() {
    this.init();
    if (!this.context || !this.masterGain || this.isMuted) return;
    const t = this.context.currentTime;

    // Diminished/Spooky Chord: A, C, Eb, F#
    const freqs = [440, 523.25, 622.25, 739.99, 880];
    
    freqs.forEach((f, i) => {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.detune.value = (Math.random() - 0.5) * 20; // Slight detune for "ghostly" feel

        // Long attack, long release
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.1 + (i * 0.05));
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 3.5);
    });
  }

  // Effect: Harsh Glitch for Failure
  playFailure() {
    this.init();
    if (!this.context || !this.masterGain || this.isMuted) return;
    const t = this.context.currentTime;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.linearRampToValueAtTime(50, t + 0.3);

    // Rapid volume modulation for glitch sound
    const lfo = this.context.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 30;
    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 1;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start(t);
    lfo.stop(t + 0.5);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.setValueAtTime(0, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }
}

export const soundService = new SoundService();
