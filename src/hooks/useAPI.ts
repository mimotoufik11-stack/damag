import { useState, useCallback } from 'react';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<APIResponse<T>> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await window.electronAPI.invoke('api:request', {
        method,
        endpoint,
        data,
      });

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Request failed');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const get = useCallback(<T>(endpoint: string) => {
    return request<T>('GET', endpoint);
  }, [request]);

  const post = useCallback(<T>(endpoint: string, data: any) => {
    return request<T>('POST', endpoint, data);
  }, [request]);

  const put = useCallback(<T>(endpoint: string, data: any) => {
    return request<T>('PUT', endpoint, data);
  }, [request]);

  const del = useCallback(<T>(endpoint: string) => {
    return request<T>('DELETE', endpoint);
  }, [request]);

  return {
    isLoading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  };
};
