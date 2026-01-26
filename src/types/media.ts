export type MediaType = 'video' | 'audio' | 'image' | 'subtitle';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
  format: string;
  width?: number;
  height?: number;
  fps?: number;
  sampleRate?: number;
  channels?: number;
  metadata?: MediaMetadata;
  createdAt: string;
}

export interface MediaMetadata {
  codec?: string;
  bitrate?: number;
  aspectRatio?: string;
  colorSpace?: string;
}
