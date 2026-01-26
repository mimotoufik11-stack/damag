import { MediaItem } from './media';
import { TimelineState } from './timeline';

export interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  settings: ProjectSettings;
  metadata?: ProjectMetadata;
  createdAt: string;
  lastModified: string;
  media?: MediaItem[];
  timeline?: TimelineState;
}

export interface ProjectSettings {
  resolution: string;
  frameRate: number;
  duration: number;
  backgroundColor?: string;
}

export interface ProjectMetadata {
  author?: string;
  tags?: string[];
  version?: number;
  thumbnailTimestamp?: number;
}
