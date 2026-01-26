import apiClient from './apiClient';

interface UploadResponse {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
  createdAt: string;
}

export const fileService = {
  // Upload a file
  upload: async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Upload multiple files
  uploadMultiple: async (
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse[]> => {
    const uploadPromises = files.map((file) => fileService.upload(file));
    const results = await Promise.all(uploadPromises);
    return results;
  },

  // Delete a file
  delete: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/media/${fileId}`);
  },

  // Get file info
  getFileInfo: async (fileId: string): Promise<UploadResponse> => {
    const response = await apiClient.get<UploadResponse>(`/media/${fileId}`);
    return response.data;
  },

  // List all files
  listFiles: async (filters?: {
    type?: 'video' | 'audio' | 'image';
    search?: string;
  }): Promise<UploadResponse[]> => {
    const response = await apiClient.get<UploadResponse[]>('/media', { params: filters });
    return response.data;
  },
};
