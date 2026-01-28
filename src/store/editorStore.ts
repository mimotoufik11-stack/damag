import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { videoService } from '../services/videoService';
import { whisperService } from '../services/whisperService';
import { quranService } from '../services/quranService';
import { exportService } from '../services/exportService';
import { RootState } from './index';
import { AppDispatch } from './index';

export interface VideoClip {
  id: string;
  path: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnail: string;
}

export interface SubtitleTrack {
  id: string;
  name: string;
  enabled: boolean;
  visible: boolean;
  locked: boolean;
  subtitles: Subtitle[];
}

export interface Subtitle {
  id: string;
  start: number;
  end: number;
  text: string;
  verse?: {
    surahNumber: number;
    ayahNumber: number;
    text: string;
    translation?: string;
  };
  style: {
    font: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    opacity: number;
    position: 'top' | 'center' | 'bottom';
    shadow: {
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
    };
    stroke: {
      color: string;
      width: number;
    };
  };
}

export interface Effect {
  id: string;
  type: 'brightness' | 'contrast' | 'saturation' | 'blur' | 'sharpen' | 'hue' | 'vignette';
  enabled: boolean;
  value: number;
  keyframes?: Array<{
    time: number;
    value: number;
    interpolation: 'linear' | 'ease';
  }>;
}

export interface ExportPreset {
  name: string;
  format: 'mp4' | 'webm' | 'mov' | 'avi';
  resolution: { width: number; height: number };
  fps: number;
  videoBitrate: string;
  audioBitrate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  videoPath: string;
  audioPath?: string;
  resolution: string;
  duration: number;
  fps: number;
  thumbnail?: string;
  subtitles: SubtitleTrack[];
  effects: Effect[];
  timeline: {
    zoom: number;
    playheadPosition: number;
    tracks: Array<{
      id: string;
      type: 'video' | 'audio' | 'subtitle';
      name: string;
      clips: any[];
    }>;
  };
  exportSettings?: ExportPreset;
}

export interface EditorState {
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  previewUrl: string | null;
  selectedClipId: string | null;
  selectedTrackId: string | null;
  playbackState: 'playing' | 'paused' | 'stopped';
  currentTime: number;
  isExporting: boolean;
  exportProgress: {
    progress: number;
    stage: string;
    timeElapsed: number;
    timeRemaining: number;
  } | null;
  fonts: string[];
  templates: Template[];
  quranDatabase: {
    surahs: any[];
    verses: any[];
  } | null;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  configuration: {
    text: {
      font: string;
      fontSize: number;
      fontWeight: number;
      color: string;
      position: string;
      shadow: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
      };
      background: {
        enabled: boolean;
        color: string;
        opacity: number;
      };
    };
    effects: Array<{
      type: string;
      enabled: boolean;
      value: number;
    }>;
  };
}

const initialState: EditorState = {
  currentProject: null,
  isLoading: false,
  error: null,
  previewUrl: null,
  selectedClipId: null,
  selectedTrackId: null,
  playbackState: 'paused',
  currentTime: 0,
  isExporting: false,
  exportProgress: null,
  fonts: [
    'Arial',
    'Amiri',
    'Scheherazade',
    'Cairo',
    'Lalezar',
    'Mada',
    'Noto Naskh Arabic',
    'Tahoma',
    'Times New Roman',
    'Verdana',
  ],
  templates: [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean white text on dark background',
      thumbnail: '',
      configuration: {
        text: {
          font: 'Cairo',
          fontSize: 60,
          fontWeight: 400,
          color: '#FFFFFF',
          position: 'bottom',
          shadow: { enabled: true, color: '#000000', blur: 10, offsetX: 2, offsetY: 2 },
          background: { enabled: false, color: '#000000', opacity: 0.5 },
        },
        effects: [],
      },
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Gradient background with animations',
      thumbnail: '',
      configuration: {
        text: {
          font: 'Cairo',
          fontSize: 70,
          fontWeight: 500,
          color: '#FFFFFF',
          position: 'center',
          shadow: { enabled: true, color: '#000000', blur: 15, offsetX: 3, offsetY: 3 },
          background: { enabled: true, color: 'linear-gradient(45deg, #1a2980, #26d0ce)', opacity: 0.8 },
        },
        effects: [{ type: 'contrast', enabled: true, value: 110 }],
      },
    },
    {
      id: 'islamic',
      name: 'Islamic',
      description: 'Golden accents with traditional patterns',
      thumbnail: '',
      configuration: {
        text: {
          font: 'Amiri',
          fontSize: 65,
          fontWeight: 600,
          color: '#FFD700',
          position: 'bottom',
          shadow: { enabled: true, color: '#000000', blur: 12, offsetX: 3, offsetY: 3 },
          background: { enabled: true, color: '#8B4513', opacity: 0.3 },
        },
        effects: [{ type: 'brightness', enabled: true, value: 105 }],
      },
    },
  ],
  quranDatabase: null,
};

// Async Thunks
export const uploadVideo = createAsyncThunk(
  'editor/uploadVideo',
  async (file: File, { rejectWithValue }) => {
    try {
      return await videoService.uploadVideo(file);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload video');
    }
  }
);

export const transcribeAudio = createAsyncThunk(
  'editor/transcribeAudio',
  async (audioPath: string, { rejectWithValue }) => {
    try {
      const result = await whisperService.transcribeAudio(audioPath);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Transcription failed');
    }
  }
);

export const matchVerses = createAsyncThunk(
  'editor/matchVerses',
  async (segments: any, { rejectWithValue }) => {
    try {
      return await quranService.matchTranscriptionToVerses(segments);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Verse matching failed');
    }
  }
);

export const loadQuranDatabase = createAsyncThunk(
  'editor/loadQuranDatabase',
  async (_, { rejectWithValue }) => {
    try {
      return await quranService.loadQuranDatabase();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load Quran database');
    }
  }
);

export const exportVideo = createAsyncThunk(
  'editor/exportVideo',
  async (renderSettings: any, { rejectWithValue, dispatch }) => {
    try {
      await exportService.exportVideo(renderSettings, (progress) => {
        dispatch(setExportProgress(progress));
      });
      return 'Export successful';
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Export failed');
    }
  }
);

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
    setSelectedClip: (state, action: PayloadAction<string>) => {
      state.selectedClipId = action.payload;
    },
    setSelectedTrack: (state, action: PayloadAction<string>) => {
      state.selectedTrackId = action.payload;
    },
    setPlaybackState: (state, action: PayloadAction<'playing' | 'paused' | 'stopped'>) => {
      state.playbackState = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    addSubtitleTrack: (state, action: PayloadAction<SubtitleTrack>) => {
      if (state.currentProject) {
        state.currentProject.subtitles.push(action.payload);
      }
    },
    addSubtitle: (state, action: PayloadAction<{ trackId: string; subtitle: Subtitle }>) => {
      if (state.currentProject) {
        const track = state.currentProject.subtitles.find(t => t.id === action.payload.trackId);
        if (track) {
          track.subtitles.push(action.payload.subtitle);
        }
      }
    },
    setSubtitleStyle: (state, action: PayloadAction<{ subtitleId: string; style: Subtitle['style'] }>) => {
      if (state.currentProject) {
        for (const track of state.currentProject.subtitles) {
          const subtitle = track.subtitles.find(s => s.id === action.payload.subtitleId);
          if (subtitle) {
            subtitle.style = action.payload.style;
            break;
          }
        }
      }
    },
    addEffect: (state, action: PayloadAction<Effect>) => {
      if (state.currentProject) {
        state.currentProject.effects.push(action.payload);
      }
    },
    setEffectEnabled: (state, action: PayloadAction<{ effectId: string; enabled: boolean }>) => {
      if (state.currentProject) {
        const effect = state.currentProject.effects.find(e => e.id === action.payload.effectId);
        if (effect) {
          effect.enabled = action.payload.enabled;
        }
      }
    },
    setEffectValue: (state, action: PayloadAction<{ effectId: string; value: number }>) => {
      if (state.currentProject) {
        const effect = state.currentProject.effects.find(e => e.id === action.payload.effectId);
        if (effect) {
          effect.value = action.payload.value;
        }
      }
    },
    setTemplate: (state, action: PayloadAction<Template>) => {
      if (state.currentProject) {
        state.currentProject.exportSettings = {
          name: action.payload.name,
          format: 'mp4',
          resolution: { width: 1920, height: 1080 },
          fps: 30,
          videoBitrate: '15M',
          audioBitrate: '192k',
        };
      }
    },
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    },
    setExportProgress: (state, action: PayloadAction<ExportProgress>) => {
      state.exportProgress = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPreviewUrl: (state, action: PayloadAction<string | null>) => {
      state.previewUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.previewUrl = action.payload.thumbnail;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Transcribe Audio
      .addCase(transcribeAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(transcribeAudio.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(transcribeAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Load Quran Database
      .addCase(loadQuranDatabase.fulfilled, (state, action) => {
        state.quranDatabase = action.payload;
      })
      // Export Video
      .addCase(exportVideo.pending, (state) => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportVideo.fulfilled, (state) => {
        state.isExporting = false;
        state.exportProgress = null;
      })
      .addCase(exportVideo.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload as string;
        state.exportProgress = null;
      });
  },
});

export const {
  setProject,
  setSelectedClip,
  setSelectedTrack,
  setPlaybackState,
  setCurrentTime,
  addSubtitleTrack,
  addSubtitle,
  setSubtitleStyle,
  addEffect,
  setEffectEnabled,
  setEffectValue,
  setTemplate,
  setIsExporting,
  setExportProgress,
  setError,
  setPreviewUrl,
} = editorSlice.actions;

export default editorSlice.reducer;

type ExportProgress = {
  progress: number;
  stage: string;
  timeElapsed: number;
  timeRemaining: number;
};