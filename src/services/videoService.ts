import apiClient from './apiClient';

interface ExportConfig {
  resolution: '720p' | '1080p' | '4K';
  format: 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high';
  frameRate: 24 | 30 | 60;
  audioQuality: '128k' | '256k' | '320k';
  includeSubtitles: boolean;
  burnSubtitles: boolean;
}

interface ExportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputPath?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export const videoService = {
  // Export video
  export: async (projectId: string, config: ExportConfig): Promise<ExportJob> => {
    const response = await apiClient.post<ExportJob>('/export', {
      projectId,
      ...config,
    });
    return response.data;
  },

  // Get export job status
  getExportStatus: async (jobId: string): Promise<ExportJob> => {
    const response = await apiClient.get<ExportJob>(`/export/${jobId}`);
    return response.data;
  },

  // Cancel export
  cancelExport: async (jobId: string): Promise<void> => {
    await apiClient.delete(`/export/${jobId}`);
  },

  // Get export history
  getExportHistory: async (projectId: string): Promise<ExportJob[]> => {
    const response = await apiClient.get<ExportJob[]>(`/export/history/${projectId}`);
    return response.data;
  },

  // Generate thumbnail
  generateThumbnail: async (videoId: string, timestamp: number = 0): Promise<string> => {
    const response = await apiClient.post<{ thumbnail: string }>(`/video/${videoId}/thumbnail`, {
      timestamp,
    });
    return response.data.thumbnail;
  },

  // Extract frames
  extractFrames: async (
    videoId: string,
    options: {
      start?: number;
      end?: number;
      interval?: number;
    }
  ): Promise<string[]> => {
    const response = await apiClient.post<{ frames: string[] }>(`/video/${videoId}/frames`, options);
    return response.data.frames;
  },
};
