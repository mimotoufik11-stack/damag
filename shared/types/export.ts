export interface ExportConfig {
  resolution: '720p' | '1080p' | '4K';
  format: 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high';
  frameRate: 24 | 30 | 60;
  audioQuality: '128k' | '256k' | '320k';
  includeSubtitles: boolean;
  burnSubtitles: boolean;
}

export interface ExportJob {
  id: string;
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  config: ExportConfig;
  outputPath?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ExportHistory {
  jobs: ExportJob[];
  totalExports: number;
  totalSize: number;
}
