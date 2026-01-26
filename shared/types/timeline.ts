import { MediaType } from './media';

export interface TimelineState {
  tracks: Track[];
  duration: number;
  currentTime: number;
  zoom: number;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  clips: Clip[];
  height: number;
  color: string;
  isVisible: boolean;
  isLocked: boolean;
  volume?: number;
  pan?: number;
}

export type TrackType = 'video' | 'audio' | 'subtitle' | 'image';

export interface Clip {
  id: string;
  trackId: string;
  name: string;
  type: MediaType;
  startTime: number;
  duration: number;
  thumbnail?: string;
  properties?: ClipProperties;
}

export interface ClipProperties {
  opacity?: number;
  volume?: number;
  speed?: number;
  pan?: number;
  position?: {
    x: number;
    y: number;
  };
  scale?: {
    x: number;
    y: number;
  };
  rotation?: number;
  filters?: string[];
}

export interface Effect {
  id: string;
  type: EffectType;
  name: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

export type EffectType = 'blur' | 'brightness' | 'contrast' | 'saturation' | 'hue' | 'colorize';
