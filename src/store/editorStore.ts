import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface Clip {
  id: string;
  trackId: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  startTime: number;
  duration: number;
  thumbnail?: string;
}

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  clips: Clip[];
  height: number;
  color: string;
}

interface HistoryState {
  tracks: Track[];
  timestamp: number;
}

interface EditorState {
  // Tool selection
  activeTool: 'select' | 'video' | 'audio' | 'image' | 'text' | 'subtitle' | 'ai' | 'settings' | 'undo' | 'redo';

  // Selection
  selectedClip: string | null;
  selectedTrack: string | null;
  selectedElements: string[];

  // Timeline
  tracks: Track[];
  currentTime: number;
  zoom: number;
  duration: number;
  isPlaying: boolean;

  // History
  history: HistoryState[];
  historyIndex: number;
  maxHistory: number;

  // Clipboard
  clipboard: any[];

  // Actions
  setActiveTool: (tool: EditorState['activeTool']) => void;
  setSelectedClip: (id: string | null) => void;
  setSelectedTrack: (id: string | null) => void;
  setSelectedElements: (elements: string[]) => void;

  // Timeline actions
  addTrack: (track: Omit<Track, 'id'>) => void;
  removeTrack: (trackId: string) => void;
  addClip: (trackId: string, clip: Omit<Clip, 'id'>) => void;
  removeClip: (clipId: string) => void;
  moveClip: (clipId: string, newStartTime: number) => void;
  resizeClip: (clipId: string, newDuration: number) => void;
  splitClip: (clipId: string, splitTime: number) => void;
  duplicateClip: (clipId: string) => void;

  // Playback
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;

  // History
  saveState: () => void;
  undo: () => void;
  redo: () => void;

  // Project
  loadProject: (projectId: string) => Promise<void>;
  saveProject: () => Promise<boolean>;

  // Clipboard
  copy: () => void;
  paste: () => void;
  cut: () => void;
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    activeTool: 'select',
    selectedClip: null,
    selectedTrack: null,
    selectedElements: [],
    tracks: [],
    currentTime: 0,
    zoom: 1,
    duration: 60,
    isPlaying: false,
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    clipboard: [],

    // Tool selection
    setActiveTool: (tool) => set({ activeTool: tool }),

    // Selection
    setSelectedClip: (id) => set({ selectedClip: id }),
    setSelectedTrack: (id) => set({ selectedTrack: id }),
    setSelectedElements: (elements) => set({ selectedElements: elements }),

    // Timeline actions
    addTrack: (track) => {
      const newTrack: Track = {
        ...track,
        id: `track_${Date.now()}`,
      };
      set((state) => ({
        tracks: [...state.tracks, newTrack],
      }));
      get().saveState();
    },

    removeTrack: (trackId) => {
      set((state) => ({
        tracks: state.tracks.filter((t) => t.id !== trackId),
        selectedTrack: state.selectedTrack === trackId ? null : state.selectedTrack,
      }));
      get().saveState();
    },

    addClip: (trackId, clip) => {
      const newClip: Clip = {
        ...clip,
        id: `clip_${Date.now()}`,
      };
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === trackId
            ? { ...track, clips: [...track.clips, newClip] }
            : track
        ),
      }));
      get().saveState();
    },

    removeClip: (clipId) => {
      const { selectedClip } = get();
      set((state) => ({
        tracks: state.tracks.map((track) => ({
          ...track,
          clips: track.clips.filter((clip) => clip.id !== clipId),
        })),
        selectedClip: selectedClip === clipId ? null : selectedClip,
      }));
      get().saveState();
    },

    moveClip: (clipId, newStartTime) => {
      set((state) => ({
        tracks: state.tracks.map((track) => ({
          ...track,
          clips: track.clips.map((clip) =>
            clip.id === clipId ? { ...clip, startTime: newStartTime } : clip
          ),
        })),
      }));
    },

    resizeClip: (clipId, newDuration) => {
      set((state) => ({
        tracks: state.tracks.map((track) => ({
          ...track,
          clips: track.clips.map((clip) =>
            clip.id === clipId ? { ...clip, duration: newDuration } : clip
          ),
        })),
      }));
    },

    splitClip: (clipId, splitTime) => {
      set((state) => ({
        tracks: state.tracks.map((track) => {
          const clipIndex = track.clips.findIndex((c) => c.id === clipId);
          if (clipIndex === -1) return track;

          const clip = track.clips[clipIndex];
          const relativeTime = splitTime - clip.startTime;

          if (relativeTime <= 0 || relativeTime >= clip.duration) return track;

          const leftClip = {
            ...clip,
            duration: relativeTime,
            id: `${clip.id}_left`,
          };
          const rightClip = {
            ...clip,
            startTime: splitTime,
            duration: clip.duration - relativeTime,
            id: `${clip.id}_right`,
          };

          return {
            ...track,
            clips: [
              ...track.clips.slice(0, clipIndex),
              leftClip,
              rightClip,
              ...track.clips.slice(clipIndex + 1),
            ],
          };
        }),
      }));
      get().saveState();
    },

    duplicateClip: (clipId) => {
      set((state) => ({
        tracks: state.tracks.map((track) => {
          const clip = track.clips.find((c) => c.id === clipId);
          if (!clip) return track;

          const newClip: Clip = {
            ...clip,
            id: `clip_${Date.now()}`,
            startTime: clip.startTime + clip.duration + 0.1,
          };

          return { ...track, clips: [...track.clips, newClip] };
        }),
      }));
      get().saveState();
    },

    // Playback
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    stop: () => set({ isPlaying: false, currentTime: 0 }),
    seek: (time) => set({ currentTime: Math.max(0, time) }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(10, zoom)) }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),

    // History
    saveState: () => {
      const { tracks, history, historyIndex, maxHistory } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({
        tracks: JSON.parse(JSON.stringify(tracks)),
        timestamp: Date.now(),
      });
      
      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      }

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const state = history[historyIndex - 1];
        set({
          tracks: JSON.parse(JSON.stringify(state.tracks)),
          historyIndex: historyIndex - 1,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const state = history[historyIndex + 1];
        set({
          tracks: JSON.parse(JSON.stringify(state.tracks)),
          historyIndex: historyIndex + 1,
        });
      }
    },

    // Project
    loadProject: async (projectId) => {
      try {
        const response = await window.electronAPI.invoke('api:request', {
          method: 'GET',
          endpoint: `/projects/${projectId}`,
        });

        if (response.success && response.data.timeline) {
          set({
            tracks: response.data.timeline.tracks || [],
            duration: response.data.settings?.duration || 60,
          });
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    },

    saveProject: async () => {
      try {
        const { tracks, duration } = get();
        const response = await window.electronAPI.invoke('api:request', {
          method: 'POST',
          endpoint: '/timeline/save',
          data: {
            tracks,
            duration,
          },
        });
        return response.success;
      } catch (error) {
        console.error('Failed to save project:', error);
        return false;
      }
    },

    // Clipboard
    copy: () => {
      const { selectedElements, tracks } = get();
      const clips = tracks
        .flatMap((track) => track.clips)
        .filter((clip) => selectedElements.includes(clip.id));
      set({ clipboard: clips });
    },

    paste: () => {
      const { clipboard, currentTime, tracks } = get();
      if (clipboard.length === 0) return;

      const newClips = clipboard.map((clip: Clip) => ({
        ...clip,
        id: `clip_${Date.now()}_${Math.random()}`,
        startTime: currentTime + (clip.startTime || 0),
      }));

      set((state) => ({
        tracks: state.tracks.map((track) => {
          const trackClips = newClips.filter((c) => c.trackId === track.id);
          if (trackClips.length === 0) return track;
          return { ...track, clips: [...track.clips, ...trackClips] };
        }),
      }));
      get().saveState();
    },

    cut: () => {
      get().copy();
      const { selectedElements } = get();
      set((state) => ({
        tracks: state.tracks.map((track) => ({
          ...track,
          clips: track.clips.filter((clip) => !selectedElements.includes(clip.id)),
        })),
      }));
      get().saveState();
    },
  }))
);
