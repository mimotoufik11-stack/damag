import { useState, useCallback } from 'react';

interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
  properties?: string[];
}

interface FileDialogResult {
  canceled: boolean;
  filePaths: string[];
}

export const useFileDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openFile = useCallback(async (options: FileDialogOptions = {}): Promise<FileDialogResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.dialog.openFile(options);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to open file dialog');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFile = useCallback(async (options: FileDialogOptions = {}): Promise<FileDialogResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.dialog.saveFile(options);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to save file dialog');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openDirectory = useCallback(async (options: FileDialogOptions = {}): Promise<FileDialogResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.dialog.openDirectory(options);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to open directory dialog');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openFileDialog = useCallback((options?: FileDialogOptions) => {
    return openFile(options);
  }, [openFile]);

  const saveFileDialog = useCallback((options?: FileDialogOptions) => {
    return saveFile(options);
  }, [saveFile]);

  const openDirectoryDialog = useCallback((options?: FileDialogOptions) => {
    return openDirectory(options);
  }, [openDirectory]);

  return {
    isLoading,
    error,
    openFile,
    saveFile,
    openDirectory,
    openFileDialog,
    saveFileDialog,
    openDirectoryDialog,
  };
};
