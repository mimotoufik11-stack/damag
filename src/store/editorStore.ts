import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface VideoClip {
  id: string;
  name: string;
  url: string;
  startTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  volume: number;
  opacity: number;
  speed: number;
  width: number;
  height: number;
  codec: string;
  thumbnail: string;
}

export interface SubtitleEntry {
  id: string;
  text: string;
  arabicText: string;
  startTime: number;
  endTime: number;
  surah: number;
  ayah: number;
  confidence: number;
  position: 'top' | 'bottom' | 'center';
  fontSize: number;
  fontFamily: string;
  fontWeight: 100 | 300 | 400 | 700 | 900;
  color: string;
  background: string;
  shadow: string;
  stroke: string;
  strokeWidth: number;
  glow: string;
  blur: number;
  opacity: number;
  kerning: number;
  letterSpacing: number;
  lineHeight: number;
  transform: 'normal' | 'uppercase' | 'lowercase';
  effect: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'pulse' | 'typewriter';
  effectDuration: number;
}

export interface AudioTrack {
  id: string;
  name: string;
  type: 'master' | 'voice' | 'effects' | 'music';
  clips: AudioClip[];
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
}

export interface AudioClip {
  id: string;
  name: string;
  url: string;
  startTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  volume: number;
  pan: number;
}

export interface VideoEffect {
  id: string;
  name: string;
  type: 
    | 'brightness'
    | 'contrast'
    | 'saturation'
    | 'hue'
    | 'blur'
    | 'sharpen'
    | 'colorGrading'
    | 'vignette'
    | 'pixelate'
    | 'invert';
  value: number;
  enabled: boolean;
}

type TimelineZoom = 0.1 | 0.25 | 0.5 | 1 | 2 | 3 | 4 | 5;

export interface EditorState {
  projectId: string | null;
  projectName: string;
  videoClips: VideoClip[];
  audioTracks: AudioTrack[];
  subtitleTrack: SubtitleEntry[];
  effects: VideoEffect[];
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  selection: {
    type: 'clip' | 'subtitle' | 'effect' | null;
    id: string | null;
  };
  timelineZoom: TimelineZoom;
  exportSettings: {
    format: 'mp4' | 'webm' | 'mov' | 'avi';
    quality: 'low' | 'medium' | 'high' | 'ultra';
    resolution: '720p' | '1080p' | '1440p' | '4k' | 'custom';
    customWidth: number;
    customHeight: number;
    aspectRatio: '16:9' | '4:3' | '1:1' | '21:9';
    fps: 24 | 30 | 60;
    bitrate: number;
    audioBitrate: number;
  };
  videoSettings: {
    width: number;
    height: number;
    aspectRatio: '16:9' | '4:3' | '1:1' | '21:9';
    scaleMode: 'fit' | 'fill' | 'stretch';
    crop: boolean;
  };
}

const initialState: EditorState = {
  projectId: null,
  projectName: 'Untitled Project',
  videoClips: [],
  audioTracks: [],
  subtitleTrack: [],
  effects: [],
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  selection: {
    type: null,
    id: null
  },
  timelineZoom: 1,
  exportSettings: {
    format: 'mp4',
    quality: 'high',
    resolution: '1080p',
    customWidth: 1920,
    customHeight: 1080,
    aspectRatio: '16:9',
    fps: 30,
    bitrate: 15000,
    audioBitrate: 320
  },
  videoSettings: {
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    scaleMode: 'fit',
    crop: false
  }
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Project
    setProject: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.projectId = action.payload.id;
      state.projectName = action.payload.name;
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },

    // Video
    addVideoClip: (state, action: PayloadAction<Partial<VideoClip>>) => {
      const clip: VideoClip = {
        id: uuidv4(),
        name: action.payload.name || 'Video Clip',
        url: action.payload.url || '',
        startTime: action.payload.startTime || 0,
        duration: action.payload.duration || 0,
        inPoint: action.payload.inPoint || 0,
        outPoint: action.payload.outPoint || 0,
        volume: 100,
        opacity: 100,
        speed: 1,
        width: action.payload.width || 0,
        height: action.payload.height || 0,
        codec: action.payload.codec || '',
        thumbnail: action.payload.thumbnail || '',
      };
      state.videoClips.push(clip);
      state.duration = Math.max(state.duration, clip.startTime + clip.duration);
    },
    removeVideoClip: (state, action: PayloadAction<string>) => {
      state.videoClips = state.videoClips.filter(clip => clip.id !== action.payload);
    },
    updateVideoClip: (state, action: PayloadAction<{ id: string; updates: Partial<VideoClip> }>) => {
      const clip = state.videoClips.find(clip => clip.id === action.payload.id);
      if (clip) {
        Object.assign(clip, action.payload.updates);
      }
    },

    // Subtitle
    addSubtitle: (state, action: PayloadAction<Partial<SubtitleEntry>>) => {
      const subtitle: SubtitleEntry = {
        id: uuidv4(),
        text: action.payload.text || '',
        arabicText: action.payload.arabicText || '',
        startTime: action.payload.startTime || 0,
        endTime: action.payload.endTime || 0,
        surah: action.payload.surah || 0,
        ayah: action.payload.ayah || 0,
        confidence: action.payload.confidence || 0,
        position: action.payload.position || 'bottom',
        fontSize: action.payload.fontSize || 48,
        fontFamily: action.payload.fontFamily || 'Amiri',
        fontWeight: action.payload.fontWeight || 400,
        color: action.payload.color || '#FFFFFF',
        background: action.payload.background || 'rgba(0, 0, 0, 0.5)',
        shadow: action.payload.shadow || '0 2px 8px rgba(0, 0, 0, 0.5)',
        stroke: action.payload.stroke || '#000000',
        strokeWidth: action.payload.strokeWidth || 1,
        glow: action.payload.glow || '0 0 0 rgba(0, 0, 0, 0)',
        blur: action.payload.blur || 0,
        opacity: action.payload.opacity || 100,
        kerning: action.payload.kerning || 0,
        letterSpacing: action.payload.letterSpacing || 0,
        lineHeight: action.payload.lineHeight || 1.2,
        transform: action.payload.transform || 'normal',
        effect: action.payload.effect || 'none',
        effectDuration: action.payload.effectDuration || 500,
      };
      state.subtitleTrack.push(subtitle);
    },
    removeSubtitle: (state, action: PayloadAction<string>) => {
      state.subtitleTrack = state.subtitleTrack.filter(sub => sub.id !== action.payload);
    },
    updateSubtitle: (state, action: PayloadAction<{ id: string; updates: Partial<SubtitleEntry> }>) => {
      const subtitle = state.subtitleTrack.find(sub => sub.id === action.payload.id);
      if (subtitle) {
        Object.assign(subtitle, action.payload.updates);
      }
    },
    clearSubtitles: (state) => {
      state.subtitleTrack = [];
    },

    // Audio
    addAudioTrack: (state, action: PayloadAction<Partial<AudioTrack>>) => {
      const track: AudioTrack = {
        id: uuidv4(),
        name: action.payload.name || 'Audio Track',
        type: action.payload.type || 'voice',
        clips: action.payload.clips || [],
        volume: 100,
        pan: 0,
        muted: false,
        solo: false,
      };
      state.audioTracks.push(track);
    },
    removeAudioTrack: (state, action: PayloadAction<string>) => {
      state.audioTracks = state.audioTracks.filter(track => track.id !== action.payload);
    },

    // Effects
    addVideoEffect: (state, action: PayloadAction<Partial<VideoEffect>>) => {
      const effect: VideoEffect = {
        id: uuidv4(),
        name: action.payload.name || 'Effect',
        type: action.payload.type || 'brightness',
        value: action.payload.value || 100,
        enabled: action.payload.enabled || true,
      };
      state.effects.push(effect);
    },
    removeVideoEffect: (state, action: PayloadAction<string>) => {
      state.effects = state.effects.filter(effect => effect.id !== action.payload);
    },
    updateVideoEffect: (state, action: PayloadAction<{ id: string; updates: Partial<VideoEffect> }>) => {
      const effect = state.effects.find(effect => effect.id === action.payload.id);
      if (effect) {
        Object.assign(effect, action.payload.updates);
      }
    },

    // Playback
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = Math.max(0, Math.min(action.payload, state.duration));
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },

    // Selection
    selectClip: (state, action: PayloadAction<string>) => {
      state.selection = { type: 'clip', id: action.payload };
    },
    selectSubtitle: (state, action: PayloadAction<string>) => {
      state.selection = { type: 'subtitle', id: action.payload };
    },
    selectEffect: (state, action: PayloadAction<string>) => {
      state.selection = { type: 'effect', id: action.payload };
    },
    clearSelection: (state) => {
      state.selection = { type: null, id: null };
    },

    // Timeline
    setTimelineZoom: (state, action: PayloadAction<TimelineZoom>) => {
      state.timelineZoom = action.payload;
    },

    // Export
    updateExportSettings: (state, action: PayloadAction<Partial<typeof state.exportSettings>>) => {
      state.exportSettings = { ...state.exportSettings, ...action.payload };
    },

    clearState: (state) => {
      state.projectId = null;
      state.projectName = 'Untitled Project';
      state.videoClips = [];
      state.audioTracks = [];
      state.subtitleTrack = [];
      state.effects = [];
      state.duration = 0;
      state.currentTime = 0;
      state.isPlaying = false;
      state.selection = { type: null, id: null };
    },
  },
});

export const {
  setProject,
  setProjectName,
  addVideoClip,
  removeVideoClip,
  updateVideoClip,
  addSubtitle,
  removeSubtitle,
  updateSubtitle,
  clearSubtitles,
  addAudioTrack,
  removeAudioTrack,
  addVideoEffect,
  removeVideoEffect,
  updateVideoEffect,
  setCurrentTime,
  play,
  pause,
  selectClip,
  selectSubtitle,
  selectEffect,
  clearSelection,
  setTimelineZoom,
  updateExportSettings,
  clearState,
} = editorSlice.actions;

export default editorSlice.reducer;