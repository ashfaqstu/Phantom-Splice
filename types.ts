export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string | null;
  spiritReading: string | null; // Gemini generated caption
}

export enum RitualState {
  IDLE = 'IDLE',
  SUMMONING = 'SUMMONING', // Dragging over
  SEVERING = 'SEVERING',   // Processing
  COMPLETE = 'COMPLETE',   // Done
  FAILED = 'FAILED'
}

export interface BackendConfig {
  useMock: boolean;
  serverUrl: string;
}