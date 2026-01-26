import { useState, useCallback } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  settings?: {
    resolution: string;
    frameRate: number;
    duration: number;
  };
  createdAt: string;
  lastModified: string;
}

interface ProjectData {
  name: string;
  description?: string;
  settings?: {
    resolution: string;
    frameRate: number;
    duration: number;
  };
}

export const useProject = () => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(async (data: ProjectData): Promise<Project | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await window.electronAPI.invoke('api:request', {
        method: 'POST',
        endpoint: '/projects',
        data,
      });

      if (response.success) {
        const project = response.data;
        setCurrentProject(project);
        setRecentProjects(prev => [project, ...prev].slice(0, 10));
        return project;
      } else {
        setError(response.error || 'Failed to create project');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProject = useCallback(async (projectId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await window.electronAPI.invoke('api:request', {
        method: 'GET',
        endpoint: `/projects/${projectId}`,
      });

      if (response.success) {
        setCurrentProject(response.data);
      } else {
        setError(response.error || 'Failed to load project');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProject = useCallback(async (): Promise<boolean> => {
    if (!currentProject) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await window.electronAPI.invoke('api:request', {
        method: 'PUT',
        endpoint: `/projects/${currentProject.id}`,
        data: currentProject,
      });

      if (response.success) {
        setCurrentProject(response.data);
        return true;
      } else {
        setError(response.error || 'Failed to save project');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await window.electronAPI.invoke('api:request', {
        method: 'DELETE',
        endpoint: `/projects/${projectId}`,
      });

      if (response.success) {
        setRecentProjects(prev => prev.filter(p => p.id !== projectId));
        if (currentProject?.id === projectId) {
          setCurrentProject(null);
        }
        return true;
      } else {
        setError(response.error || 'Failed to delete project');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const fetchRecentProjects = useCallback(async (): Promise<Project[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await window.electronAPI.invoke('api:request', {
        method: 'GET',
        endpoint: '/projects?recent=true',
      });

      if (response.success) {
        setRecentProjects(response.data);
        return response.data;
      } else {
        setError(response.error || 'Failed to fetch projects');
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeProject = useCallback(() => {
    setCurrentProject(null);
  }, []);

  return {
    currentProject,
    recentProjects,
    isLoading,
    error,
    createProject,
    loadProject,
    saveProject,
    deleteProject,
    fetchRecentProjects,
    closeProject,
  };
};
