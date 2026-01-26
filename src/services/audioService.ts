import apiClient from './apiClient';

interface AudioEffect {
  type: 'normalize' | 'denoise' | 'reverb' | 'equalizer';
  parameters?: Record<string, any>;
}

interface AudioMix {
  tracks: Array<{
    id: string;
    volume: number;
    pan: number;
  }>;
  outputFormat: 'mp3' | 'wav' | 'aac';
  quality: number;
}

interface TranscriptionResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  text?: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
    confidence: number;
  }>;
  language?: string;
}

export const audioService = {
  // Mix audio tracks
  mix: async (projectId: string, mix: AudioMix): Promise<string> => {
    const response = await apiClient.post<{ url: string }>(`/audio/mix/${projectId}`, mix);
    return response.data.url;
  },

  // Apply audio effect
  applyEffect: async (audioId: string, effect: AudioEffect): Promise<string> => {
    const response = await apiClient.post<{ url: string }>(`/audio/${audioId}/effect`, effect);
    return response.data.url;
  },

  // Normalize audio
  normalize: async (audioId: string, targetLevel: number = -3): Promise<string> => {
    return audioService.applyEffect(audioId, {
      type: 'normalize',
      parameters: { targetLevel },
    });
  },

  // Remove noise
  denoise: async (audioId: string): Promise<string> => {
    return audioService.applyEffect(audioId, { type: 'denoise' });
  },

  // Convert audio format
  convert: async (audioId: string, format: 'mp3' | 'wav' | 'aac', bitrate?: number): Promise<string> => {
    const response = await apiClient.post<{ url: string }>(`/audio/${audioId}/convert`, {
      format,
      bitrate,
    });
    return response.data.url;
  },

  // Generate waveform
  generateWaveform: async (audioId: string): Promise<number[]> => {
    const response = await apiClient.get<{ waveform: number[] }>(`/audio/${audioId}/waveform`);
    return response.data.waveform;
  },

  // Transcribe audio to text
  transcribe: async (
    audioId: string,
    options: {
      language?: string;
      model?: 'base' | 'small' | 'medium' | 'large';
    } = {}
  ): Promise<TranscriptionResponse> => {
    const response = await apiClient.post<TranscriptionResponse>(`/audio/${audioId}/transcribe`, options);
    return response.data;
  },

  // Get transcription status
  getTranscriptionStatus: async (jobId: string): Promise<TranscriptionResponse> => {
    const response = await apiClient.get<TranscriptionResponse>(`/audio/transcribe/${jobId}`);
    return response.data;
  },

  // Text to speech
  textToSpeech: async (
    text: string,
    options: {
      language?: string;
      voice?: string;
      speed?: number;
      pitch?: number;
    } = {}
  ): Promise<string> => {
    const response = await apiClient.post<{ url: string }>('/audio/tts', {
      text,
      ...options,
    });
    return response.data.url;
  },

  // Get available voices for TTS
  getVoices: async (language?: string): Promise<
    Array<{
      id: string;
      name: string;
      language: string;
      gender: 'male' | 'female';
    }>
  > => {
    const response = await apiClient.get('/audio/tts/voices', { params: { language } });
    return response.data;
  },
};
