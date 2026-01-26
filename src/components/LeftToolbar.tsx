import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { Type, Music, Wand, FileVideo, Image, Layers, Mic, Settings } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: any;
  shortcut?: string;
}

const tools: Tool[] = [
  { id: 'select', name: 'تحديد', icon: Layers, shortcut: 'V' },
  { id: 'video', name: 'فيديو', icon: FileVideo, shortcut: '1' },
  { id: 'audio', name: 'صوت', icon: Music, shortcut: '2' },
  { id: 'image', name: 'صورة', icon: Image, shortcut: '3' },
  { id: 'text', name: 'نص', icon: Type, shortcut: 'T' },
  { id: 'subtitle', name: 'ترجمة', icon: Mic, shortcut: 'S' },
  { id: 'ai', name: 'ذكاء اصطناعي', icon: Wand, shortcut: 'A' },
  { id: 'settings', name: 'إعدادات', icon: Settings, shortcut: ',' },
];

const LeftToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore();

  return (
    <div className="w-16 bg-slate-800/50 border-l border-slate-700/50 flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(activeTool === tool.id ? 'select' : tool.id)}
            className={`relative p-3 rounded-xl transition-all group ${
              activeTool === tool.id
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
            title={`${tool.name} (${tool.shortcut})`}
          >
            <Icon className="w-5 h-5" />
            {tool.shortcut && (
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">
                {tool.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default LeftToolbar;
