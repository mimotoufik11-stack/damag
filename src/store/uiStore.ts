import { create } from 'zustand';

interface ModalContent {
  title: string;
  content: React.ReactNode;
  onClose?: () => void;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  sidebarWidth: number;
  rightPanelWidth: number;

  // Modal
  modal: {
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
    onClose?: () => void;
  };

  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;

  // Loading
  isLoading: boolean;
  loadingMessage?: string;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;

  openModal: (modal: ModalContent) => void;
  closeModal: () => void;

  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  rightPanelOpen: true,
  sidebarWidth: 280,
  rightPanelWidth: 320,

  modal: {
    isOpen: false,
    title: '',
    content: null,
  },

  notifications: [],

  isLoading: false,
  loadingMessage: undefined,

  setTheme: (theme) => set({ theme }),

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  setRightPanelOpen: (rightPanelOpen) => set({ rightPanelOpen }),

  setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

  setRightPanelWidth: (rightPanelWidth) => set({ rightPanelWidth }),

  openModal: (modal) =>
    set({
      modal: {
        isOpen: true,
        ...modal,
      },
    }),

  closeModal: () =>
    set({
      modal: {
        isOpen: false,
        title: '',
        content: null,
        onClose: undefined,
      },
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: `notif_${Date.now()}`,
          ...notification,
        },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  setLoading: (isLoading, loadingMessage) =>
    set({
      isLoading,
      loadingMessage,
    }),
}));
