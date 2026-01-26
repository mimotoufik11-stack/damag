// App constants
export const APP_NAME = 'دماج للقرآن الكريم';
export const APP_NAME_EN = 'Dammaj Al-Quran';
export const APP_VERSION = '1.0.0';

// Video settings
export const VIDEO_RESOLUTIONS = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4K': { width: 3840, height: 2160 },
};

export const VIDEO_FORMATS = ['mp4', 'webm', 'mov', 'avi'] as const;
export const VIDEO_QUALITY = ['low', 'medium', 'high'] as const;
export const FRAME_RATES = [24, 25, 30, 50, 60] as const;

// Audio settings
export const AUDIO_FORMATS = ['mp3', 'wav', 'aac', 'm4a', 'ogg'] as const;
export const AUDIO_BITRATES = ['128k', '192k', '256k', '320k'] as const;
export const AUDIO_SAMPLE_RATES = [22050, 44100, 48000, 96000] as const;

// Subtitle formats
export const SUBTITLE_FORMATS = ['srt', 'vtt', 'ass'] as const;

// Storage limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
export const MAX_PROJECT_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
export const CACHE_SIZE_LIMIT = 1024 * 1024 * 1024; // 1GB

// Time formats
export const TIME_FORMATS = {
  SECONDS: 'seconds',
  MM_SS: 'mm:ss',
  HH_MM_SS: 'hh:mm:ss',
  HH_MM_SS_MS: 'hh:mm:ss.ms',
  HH_MM_SS_FF: 'hh:mm:ss:ff',
} as const;

// History limits
export const MAX_HISTORY = 100;
export const MAX_CLIPBOARD = 50;

// UI constants
export const DEFAULT_TIMELINE_HEIGHT = 300;
export const DEFAULT_TRACK_HEIGHT = 60;
export const MIN_CLIP_WIDTH = 10; // pixels
export const PIXELS_PER_SECOND = 30;

// Font defaults
export const DEFAULT_FONTS = [
  'Amiri',
  'Cairo',
  'Noto Naskh Arabic',
  'Scheherazade New',
] as const;

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

// Keyboard shortcuts
export const SHORTCUTS = {
  SAVE: 'Ctrl+S',
  OPEN: 'Ctrl+O',
  NEW: 'Ctrl+N',
  EXPORT: 'Ctrl+E',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Shift+Z',
  DELETE: 'Delete',
  COPY: 'Ctrl+C',
  PASTE: 'Ctrl+V',
  CUT: 'Ctrl+X',
  SELECT_ALL: 'Ctrl+A',
  PLAY_PAUSE: 'Space',
  SPLIT: 'S',
} as const;

// File extensions
export const SUPPORTED_VIDEO_EXTENSIONS = [
  '.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv',
] as const;

export const SUPPORTED_AUDIO_EXTENSIONS = [
  '.mp3', '.wav', '.aac', '.m4a', '.ogg', '.flac', '.wma',
] as const;

export const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg',
] as const;

export const SUPPORTED_SUBTITLE_EXTENSIONS = [
  '.srt', '.vtt', '.ass', '.ssa',
] as const;
