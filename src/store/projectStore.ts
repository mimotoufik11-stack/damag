import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  settings: {
    resolution: string;
    frameRate: number;
    duration: number;
  };
  createdAt: string;
  lastModified: string;
  media?: any[];
  timeline?: any;
}

interface ProjectState {
  currentProject: Project | null;
  recentProjects: Project[];
  isLoading: boolean;
  error: string | null;

  setCurrentProject: (project: Project | null) => void;
  setRecentProjects: (projects: Project[]) => void;
  addToRecentProjects: (project: Project) => void;
  createProject: (data: Partial<Project>) => Promise<Project | null>;
  loadProject: (projectId: string) => Promise<void>;
  saveProject: () => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<void>;
  closeProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      recentProjects: [],
      isLoading: false,
      error: null,

      setCurrentProject: (project) => set({ currentProject: project }),

      setRecentProjects: (projects) => set({ recentProjects: projects }),

      addToRecentProjects: (project) => {
        const { recentProjects } = get();
        const filtered = recentProjects.filter(p => p.id !== project.id);
        set({ recentProjects: [project, ...filtered].slice(0, 10) });
      },

      createProject: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await window.electronAPI.invoke('api:request', {
            method: 'POST',
            endpoint: '/projects',
            data: {
              name: data.name || 'Untitled Project',
              description: data.description || '',
              settings: data.settings || {
                resolution: '1920x1080',
                frameRate: 30,
                duration: 60,
              },
            },
          });

          if (response.success) {
            const project = response.data;
            set({ currentProject: project, isLoading: false });
            get().addToRecentProjects(project);
            return project;
          } else {
            set({ error: response.error || 'Failed to create project', isLoading: false });
            return null;
          }
        } catch (err: any) {
          set({ error: err.message || 'An error occurred', isLoading: false });
          return null;
        }
      },

      loadProject: async (projectId) => {
        set({ isLoading: true, error: null });

        try {
          const response = await window.electronAPI.invoke('api:request', {
            method: 'GET',
            endpoint: `/projects/${projectId}`,
          });

          if (response.success) {
            set({ currentProject: response.data, isLoading: false });
          } else {
            set({ error: response.error || 'Failed to load project', isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message || 'An error occurred', isLoading: false });
        }
      },

      saveProject: async () => {
        const { currentProject } = get();
        if (!currentProject) return false;

        set({ isLoading: true, error: null });

        try {
          const response = await window.electronAPI.invoke('api:request', {
            method: 'PUT',
            endpoint: `/projects/${currentProject.id}`,
            data: currentProject,
          });

          if (response.success) {
            set({ currentProject: response.data, isLoading: false });
            return true;
          } else {
            set({ error: response.error || 'Failed to save project', isLoading: false });
            return false;
          }
        } catch (err: any) {
          set({ error: err.message || 'An error occurred', isLoading: false });
          return false;
        }
      },

      deleteProject: async (projectId) => {
        set({ isLoading: true, error: null });

        try {
          const response = await window.electronAPI.invoke('api:request', {
            method: 'DELETE',
            endpoint: `/projects/${projectId}`,
          });

          if (response.success) {
            const { currentProject, recentProjects } = get();
            set({
              currentProject: currentProject?.id === projectId ? null : currentProject,
              recentProjects: recentProjects.filter(p => p.id !== projectId),
              isLoading: false,
            });
          } else {
            set({ error: response.error || 'Failed to delete project', isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message || 'An error occurred', isLoading: false });
        }
      },

      closeProject: () => {
        set({ currentProject: null });
      },
    }),
    {
      name: 'dammaj-project-storage',
      partialize: (state) => ({ recentProjects: state.recentProjects }),
    }
  )
);
