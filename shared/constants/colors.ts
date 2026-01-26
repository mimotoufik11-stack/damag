// Color Constants

export const ISLAMIC_COLORS = {
  // Emerald/Green tones
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Gold/Amber tones
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Teal tones
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Navy tones
  navy: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d5ff',
    300: '#a4bbff',
    400: '#819aff',
    500: '#617fff',
    600: '#4f66ff',
    700: '#4154ee',
    800: '#3846d6',
    900: '#3138be',
  },

  // Slate/Dark tones
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const;

export const THEME_COLORS = {
  primary: '#10b981',
  secondary: '#f59e0b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  secondary: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  emeraldGold: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #f59e0b 100%)',
  dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  islamic: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 25%, #0f172a 50%, #1e293b 75%, #0f172a 100%)',
} as const;

export const SEMANTIC_COLORS = {
  video: '#3b82f6',
  audio: '#10b981',
  subtitle: '#f59e0b',
  image: '#a855f7',
} as const;
