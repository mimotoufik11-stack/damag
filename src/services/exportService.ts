export interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov' | 'avi';
  resolution: {
    width: number;
    height: number;
  };
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: number;
  videoCodec?: string;
  audioCodec: 'aac' | 'mp3' | 'flac';
  audioBitrate: number;
  videoBitrate?: string;
  metadata?: {
    title?: string;
    description?: string;
    artist?: string;
    album?: string;
  };
}

export interface ExportProgress {
  progress: number;
  stage: string;
  timeElapsed: number;
  timeRemaining: number;
  currentFrame?: number;
  totalFrames?: number;
  error?: string;
}

export interface RenderSettings {
  videoPath: string;
  subtitles: any[];
  audioTracks: any[];
  effects: any[];
  outputPath: string;
  exportSettings: ExportSettings;
}

class ExportService {
  private apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private ws: WebSocket | null = null;
  private progressCallback: ((progress: ExportProgress) => void) | null = null;

  async exportVideo(renderSettings: RenderSettings, onProgress?: (progress: ExportProgress) => void): Promise<string> {
    this.progressCallback = onProgress || null;

    return new Promise((resolve, reject) => {
      const wsUrl = this.apiBase.replace('http', 'ws');
      this.ws = new WebSocket(`${wsUrl}/export/ws`);

      this.ws.onopen = () => {
        this.ws?.send(JSON.stringify(renderSettings));
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'progress') {
          if (this.progressCallback) {
            this.progressCallback(data.progress);
          }
        } else if (data.type === 'complete') {
          this.ws?.close();
          resolve(data.outputPath);
        } else if (data.type === 'error') {
          this.ws?.close();
          reject(new Error(data.error));
        }
      };

      this.ws.onerror = () => {
        reject(new Error('WebSocket connection failed'));
      };

      this.ws.onclose = () => {
        this.ws = null;
      };
    });
  }

  async exportVideoPoll(renderSettings: RenderSettings, onProgress?: (progress: ExportProgress) => void): Promise<string> {
    const response = await fetch(`${this.apiBase}/export/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(renderSettings),
    });

    if (!response.ok) {
      throw new Error('Failed to start export');
    }

    const { jobId } = await response.json();

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const progressResponse = await fetch(`${this.apiBase}/export/progress/${jobId}`);
          
          if (!progressResponse.ok) {
            clearInterval(interval);
            reject(new Error('Failed to get export progress'));
            return;
          }

          const progress = await progressResponse.json();
          
          if (onProgress) {
            onProgress(progress);
          }

          if (progress.status === 'completed') {
            clearInterval(interval);
            resolve(progress.outputPath);
          } else if (progress.status === 'failed') {
            clearInterval(interval);
            reject(new Error(progress.error || 'Export failed'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 500);
    });
  }

  async cancelExport(jobId: string): Promise<void> {
    const response = await fetch(`${this.apiBase}/export/cancel/${jobId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel export');
    }
  }

  async getPresets(): Promise<ExportSettings[]> {
    return [
      {
        format: 'mp4',
        resolution: { width: 1280, height: 720 },
        quality: 'medium',
        fps: 30,
        audioCodec: 'aac',
        audioBitrate: 128,
        videoBitrate: '5M',
      },
      {
        format: 'mp4',
        resolution: { width: 1920, height: 1080 },
        quality: 'high',
        fps: 30,
        audioCodec: 'aac',
        audioBitrate: 192,
        videoBitrate: '15M',
      },
      {
        format: 'webm',
        resolution: { width: 1920, height: 1080 },
        quality: 'high',
        fps: 30,
        audioCodec: 'aac',
        audioBitrate: 192,
        videoBitrate: '12M',
      },
    ];
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const exportService = new ExportService();