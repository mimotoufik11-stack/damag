import React, { useState } from 'react';
import { FileText, Plus, Trash2, ArrowUp, ArrowDown, Play, Pause } from 'lucide-react';

interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface SubtitleEditorProps {
  subtitles?: Subtitle[];
  currentTime?: number;
  onChange?: (subtitles: Subtitle[]) => void;
}

const SubtitleEditor: React.FC<SubtitleEditorProps> = ({
  subtitles: initialSubtitles = [],
  currentTime = 0,
  onChange,
}) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    { id: '1', startTime: 0, endTime: 3.5, text: 'بسم الله الرحمن الرحيم' },
    { id: '2', startTime: 4, endTime: 8, text: 'الحمد لله رب العالمين' },
    { id: '3', startTime: 8.5, endTime: 12, text: 'الرحمن الرحيم' },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddSubtitle = () => {
    const newSubtitle: Subtitle = {
      id: Date.now().toString(),
      startTime: currentTime,
      endTime: currentTime + 2,
      text: 'نص جديد',
    };
    const updated = [...subtitles, newSubtitle].sort((a, b) => a.startTime - b.startTime);
    setSubtitles(updated);
    setSelectedId(newSubtitle.id);
    onChange?.(updated);
  };

  const handleDeleteSubtitle = (id: string) => {
    const updated = subtitles.filter(s => s.id !== id);
    setSubtitles(updated);
    if (selectedId === id) setSelectedId(null);
    onChange?.(updated);
  };

  const handleUpdateSubtitle = (id: string, updates: Partial<Subtitle>) => {
    const updated = subtitles.map(s => s.id === id ? { ...s, ...updates } : s);
    setSubtitles(updated);
    onChange?.(updated);
  };

  const handleMoveSubtitle = (id: string, direction: 'up' | 'down') => {
    const index = subtitles.findIndex(s => s.id === id);
    if (index < 0) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= subtitles.length) return;

    const updated = [...subtitles];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSubtitles(updated);
    onChange?.(updated);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const [mins, rest] = parts;
      const [secs, ms] = rest.split('.');
      return parseInt(mins) * 60 + parseInt(secs) + (parseInt(ms || '0') / 100);
    }
    return 0;
  };

  const getActiveSubtitle = () => {
    return subtitles.find(s => currentTime >= s.startTime && currentTime <= s.endTime);
  };

  const activeSubtitle = getActiveSubtitle();

  return (
    <div className="h-full flex flex-col bg-slate-900/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">الترجمة</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={handleAddSubtitle}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            إضافة
          </button>
        </div>
      </div>

      {/* Current Subtitle Preview */}
      {activeSubtitle && (
        <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/30">
          <div className="text-xs text-emerald-400 mb-1">الترجمة الحالية</div>
          <p className="text-lg text-white text-center" dir="rtl">
            {activeSubtitle.text}
          </p>
          <div className="text-center text-sm text-slate-400 mt-2">
            {formatTime(activeSubtitle.startTime)} → {formatTime(activeSubtitle.endTime)}
          </div>
        </div>
      )}

      {/* Subtitles List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {subtitles.map((subtitle, index) => {
          const isActive = selectedId === subtitle.id;
          const isCurrentlyPlaying = activeSubtitle?.id === subtitle.id;

          return (
            <div
              key={subtitle.id}
              onClick={() => setSelectedId(subtitle.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isCurrentlyPlaying
                  ? 'border-emerald-500 bg-emerald-500/20'
                  : isActive
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              {/* Time Controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">#{index + 1}</span>
                  <input
                    type="text"
                    value={formatTime(subtitle.startTime)}
                    onChange={(e) => handleUpdateSubtitle(subtitle.id, { startTime: parseTime(e.target.value) })}
                    className="w-20 px-2 py-1 bg-slate-900/50 border border-slate-700/50 rounded text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-400">→</span>
                  <input
                    type="text"
                    value={formatTime(subtitle.endTime)}
                    onChange={(e) => handleUpdateSubtitle(subtitle.id, { endTime: parseTime(e.target.value) })}
                    className="w-20 px-2 py-1 bg-slate-900/50 border border-slate-700/50 rounded text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-500">
                    ({(subtitle.endTime - subtitle.startTime).toFixed(1)}s)
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveSubtitle(subtitle.id, 'up');
                    }}
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveSubtitle(subtitle.id, 'down');
                    }}
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                    disabled={index === subtitles.length - 1}
                  >
                    <ArrowDown className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubtitle(subtitle.id);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </button>
                </div>
              </div>

              {/* Text */}
              <textarea
                value={subtitle.text}
                onChange={(e) => handleUpdateSubtitle(subtitle.id, { text: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                dir="auto"
              />
            </div>
          );
        })}

        {subtitles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-2">لا توجد ترجمة</p>
            <button
              onClick={handleAddSubtitle}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              أضف ترجمة الآن
            </button>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            إجمالي: <span className="text-white font-medium">{subtitles.length}</span> سطر
          </span>
          <span className="text-slate-400">
            المدة: <span className="text-white font-medium">
              {subtitles.length > 0
                ? formatTime(subtitles[subtitles.length - 1].endTime)
                : '0:00.00'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubtitleEditor;
