export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
  size: number;
  thumbnail?: string;
}

export interface VideoFile {
  id: string;
  name: string;
  path: string;
  type: string;
  metadata: VideoMetadata;
  thumbnail: string;
}

class VideoService {
  private apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  async uploadVideo(file: File): Promise<VideoFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.apiBase}/video/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Video upload failed');
    }

    return response.json();
  }

  async getVideoInfo(filePath: string): Promise<VideoMetadata> {
    const response = await fetch(`${this.apiBase}/video/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      throw new Error('Failed to get video info');
    }

    return response.json();
  }

  async extractAudio(videoPath: string): Promise<string> {
    const response = await fetch(`${this.apiBase}/video/extract-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract audio');
    }

    const data = await response.json();
    return data.audioPath;
  }

  async generateThumbnail(videoPath: string, time: number = 1): Promise<string> {
    const response = await fetch(`${this.apiBase}/video/thumbnail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath, time }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate thumbnail');
    }

    const data = await response.json();
    return data.thumbnailPath;
  }
}

export const videoService = new VideoService();