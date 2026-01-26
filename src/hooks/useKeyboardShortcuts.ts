import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description?: string;
}

interface KeyboardShortcuts {
  [key: string]: Shortcut;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      for (const shortcutId in shortcuts) {
        const shortcut = shortcuts[shortcutId];
        
        if (
          shortcut.key.toLowerCase() === key &&
          !!shortcut.ctrlKey === e.ctrlKey &&
          !!shortcut.shiftKey === e.shiftKey &&
          !!shortcut.altKey === e.altKey &&
          !!shortcut.metaKey === e.metaKey
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const defaultShortcuts: KeyboardShortcuts = {
  save: {
    key: 's',
    ctrlKey: true,
    action: () => console.log('Save'),
    description: 'حفظ المشروع',
  },
  open: {
    key: 'o',
    ctrlKey: true,
    action: () => console.log('Open'),
    description: 'فتح مشروع',
  },
  new: {
    key: 'n',
    ctrlKey: true,
    action: () => console.log('New'),
    description: 'مشروع جديد',
  },
  export: {
    key: 'e',
    ctrlKey: true,
    action: () => console.log('Export'),
    description: 'تصدير',
  },
  undo: {
    key: 'z',
    ctrlKey: true,
    action: () => console.log('Undo'),
    description: 'تراجع',
  },
  redo: {
    key: 'z',
    ctrlKey: true,
    shiftKey: true,
    action: () => console.log('Redo'),
    description: 'إعادة',
  },
  delete: {
    key: 'delete',
    action: () => console.log('Delete'),
    description: 'حذف',
  },
  selectTool: {
    key: 'v',
    action: () => console.log('Select'),
    description: 'أداة التحديد',
  },
  textTool: {
    key: 't',
    action: () => console.log('Text'),
    description: 'أداة النص',
  },
  videoTool: {
    key: '1',
    action: () => console.log('Video'),
    description: 'أداة الفيديو',
  },
  audioTool: {
    key: '2',
    action: () => console.log('Audio'),
    description: 'أداة الصوت',
  },
  imageTool: {
    key: '3',
    action: () => console.log('Image'),
    description: 'أداة الصورة',
  },
  playPause: {
    key: ' ',
    action: () => console.log('Play/Pause'),
    description: 'تشغيل/إيقاف',
  },
  split: {
    key: 's',
    action: () => console.log('Split'),
    description: 'تقسيم المقطع',
  },
  copy: {
    key: 'c',
    ctrlKey: true,
    action: () => console.log('Copy'),
    description: 'نسخ',
  },
  paste: {
    key: 'v',
    ctrlKey: true,
    action: () => console.log('Paste'),
    description: 'لصق',
  },
  duplicate: {
    key: 'd',
    ctrlKey: true,
    action: () => console.log('Duplicate'),
    description: 'تكرار',
  },
};
