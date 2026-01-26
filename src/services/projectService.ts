import apiClient from './apiClient';

interface Project {
  id: string;
  name: string;
  description?: string;
  settings: {
    resolution: string;
    frameRate: number;
    duration: number;
  };
  thumbnail?: string;
  createdAt: string;
  lastModified: string;
  media?: any[];
  timeline?: any;
}

interface ProjectData {
  name: string;
  description?: string;
  settings?: {
    resolution?: string;
    frameRate?: number;
    duration?: number;
  };
}

export const projectService = {
  // Create new project
  create: async (data: ProjectData): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  },

  // Get all projects
  getAll: async (options?: {
    limit?: number;
    offset?: number;
    search?: string;
    recent?: boolean;
  }): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects', { params: options });
    return response.data;
  },

  // Get project by ID
  getById: async (projectId: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${projectId}`);
    return response.data;
  },

  // Update project
  update: async (projectId: string, data: Partial<ProjectData>): Promise<Project> => {
    const response = await apiClient.put<Project>(`/projects/${projectId}`, data);
    return response.data;
  },

  // Delete project
  delete: async (projectId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
  },

  // Duplicate project
  duplicate: async (projectId: string, newName?: string): Promise<Project> => {
    const response = await apiClient.post<Project>(`/projects/${projectId}/duplicate`, {
      name: newName,
    });
    return response.data;
  },

  // Export project data
  export: async (projectId: string, format: 'json' | 'xml' = 'json'): Promise<Blob> => {
    const response = await apiClient.get(`/projects/${projectId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Import project data
  import: async (file: File): Promise<Project> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<Project>('/projects/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Auto-save project
  autoSave: async (projectId: string, data: any): Promise<Project> => {
    const response = await apiClient.post<Project>(`/projects/${projectId}/autosave`, data);
    return response.data;
  },

  // Get project statistics
  getStats: async (projectId: string): Promise<{
    mediaCount: number;
    totalDuration: number;
    size: number;
    lastSaved: string;
  }> => {
    const response = await apiClient.get(`/projects/${projectId}/stats`);
    return response.data;
  },
};
