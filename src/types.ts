export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string | null;
  spiritReading: string | null;
}

export enum RitualState {
  IDLE = 'IDLE',
  SUMMONING = 'SUMMONING',
  SEVERING = 'SEVERING',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED'
}

export interface BackendConfig {
  useMock: boolean;
  serverUrl: string;
}
