export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  confidence: number;
  words?: WordWithTimestamps[];
}

export interface WordWithTimestamps {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface TranscriptionResult {
  segments: TranscriptionSegment[];
  language: string;
  duration: number;
  segmentsCount: number;
}

class WhisperService {
  private apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  async transcribeAudio(audioPath: string, language: string = 'ar'): Promise<TranscriptionResult> {
    const response = await fetch(`${this.apiBase}/whisper/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioPath, language }),
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    return response.json();
  }

  async transcribeSegments(audioPath: string, language: string = 'ar'): Promise<TranscriptionResult> {
    const response = await fetch(`${this.apiBase}/whisper/transcribe-segments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioPath, language }),
    });

    if (!response.ok) {
      throw new Error('Segmented transcription failed');
    }

    return response.json();
  }

  async getAudioDuration(audioPath: string): Promise<number> {
    const response = await fetch(`${this.apiBase}/audio/duration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioPath }),
    });

    if (!response.ok) {
      throw new Error('Failed to get audio duration');
    }

    const data = await response.json();
    return data.duration;
  }

  async detectPauses(audioPath: string, threshold: number = 0.5): Promise<{ start: number; end: number; }[]> {
    const response = await fetch(`${this.apiBase}/audio/detect-pauses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioPath, threshold }),
    });

    if (!response.ok) {
      throw new Error('Failed to detect pauses');
    }

    return response.json();
  }
}

export const whisperService = new WhisperService();