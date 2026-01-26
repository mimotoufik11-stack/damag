import { useState, useCallback, useEffect } from 'react';

interface EditorState {
  activeTool: 'select' | 'video' | 'audio' | 'image' | 'text' | 'subtitle' | 'ai' | 'settings' | 'undo' | 'redo';
  selectedElements: string[];
  clipboard: any[];
  history: any[];
  historyIndex: number;
  isModified: boolean;
}

export const useEditor = () => {
  const [state, setState] = useState<EditorState>({
    activeTool: 'select',
    selectedElements: [],
    clipboard: [],
    history: [],
    historyIndex: -1,
    isModified: false,
  });

  const setActiveTool = useCallback((tool: EditorState['activeTool']) => {
    setState(prev => ({ ...prev, activeTool: tool }));
  }, []);

  const selectElement = useCallback((elementId: string) => {
    setState(prev => ({
      ...prev,
      selectedElements: [...prev.selectedElements, elementId],
    }));
  }, []);

  const deselectElement = useCallback((elementId: string) => {
    setState(prev => ({
      ...prev,
      selectedElements: prev.selectedElements.filter(id => id !== elementId),
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedElements: [] }));
  }, []);

  const selectAll = useCallback((elementIds: string[]) => {
    setState(prev => ({ ...prev, selectedElements: elementIds }));
  }, []);

  const copy = useCallback(() => {
    setState(prev => ({ ...prev, clipboard: [...prev.selectedElements] }));
  }, []);

  const paste = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedElements: [...prev.clipboard],
    }));
  }, []);

  const duplicate = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedElements: prev.selectedElements.map(id => `${id}_copy_${Date.now()}`),
    }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => ({
      ...prev,
      historyIndex: Math.max(-1, prev.historyIndex - 1),
      isModified: true,
    }));
  }, []);

  const redo = useCallback(() => {
    setState(prev => ({
      ...prev,
      historyIndex: Math.min(prev.history.length - 1, prev.historyIndex + 1),
      isModified: true,
    }));
  }, []);

  const canUndo = state.historyIndex > -1;
  const canRedo = state.historyIndex < state.history.length - 1;

  const deleteSelected = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedElements: [],
      isModified: true,
    }));
  }, []);

  const saveState = useCallback((newState: any) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newState);
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isModified: true,
      };
    });
  }, []);

  const markAsSaved = useCallback(() => {
    setState(prev => ({ ...prev, isModified: false }));
  }, []);

  return {
    ...state,
    setActiveTool,
    selectElement,
    deselectElement,
    clearSelection,
    selectAll,
    copy,
    paste,
    duplicate,
    undo,
    redo,
    deleteSelected,
    saveState,
    markAsSaved,
    canUndo,
    canRedo,
  };
};
