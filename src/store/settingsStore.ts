import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';

  // Project
  autoSave: boolean;
  autoSaveInterval: number;
  maxUndoHistory: number;

  // Export
  exportPath: string;
  exportQuality: 'low' | 'medium' | 'high';
  exportFormat: 'mp4' | 'webm';
  exportResolution: '720p' | '1080p' | '4K';

  // System
  hardwareAcceleration: boolean;
  notifications: boolean;
  cacheSize: number;
}

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  language: 'ar',
  autoSave: true,
  autoSaveInterval: 5,
  maxUndoHistory: 50,
  exportPath: '',
  exportQuality: 'high',
  exportFormat: 'mp4',
  exportResolution: '1080p',
  hardwareAcceleration: true,
  notifications: true,
  cacheSize: 1024, // MB
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (updates) => {
        set((state) => ({ ...state, ...updates }));
      },

      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'dammaj-settings-storage',
    }
  )
);
