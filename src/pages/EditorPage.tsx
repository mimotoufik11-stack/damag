import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditorStore } from '../store/editorStore';
import { useProjectStore } from '../store/projectStore';
import VideoPreview from '../components/VideoPreview';
import Timeline from '../components/Timeline';
import LeftToolbar from '../components/LeftToolbar';
import TextPanel from '../components/TextPanel';
import AudioPanel from '../components/AudioPanel';
import AIToolsPanel from '../components/AIToolsPanel';
import ExportPanel from '../components/ExportPanel';
import { ArrowRight, Play, Pause, Save, Undo, Redo } from 'lucide-react';

const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { loadProject, saveProject, activeTool, setActiveTool } = useEditorStore();
  const { currentProject } = useProjectStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  const handleSave = async () => {
    await saveProject();
  };

  const handleExport = () => {
    setShowExport(true);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const getPanelContent = () => {
    switch (activeTool) {
      case 'text':
        return <TextPanel />;
      case 'audio':
        return <AudioPanel />;
      case 'ai':
        return <AIToolsPanel />;
      case 'export':
        return <ExportPanel onClose={() => setShowExport(false)} />;
      default:
        return null;
    }
  };

  if (!currentProject && projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">جاري تحميل المشروع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900" dir="rtl">
      {/* Top Toolbar */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="العودة للصفحة الرئيسية"
          >
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">{currentProject?.name || 'مشروع بدون اسم'}</h2>
            <p className="text-sm text-slate-400">{currentProject?.description || 'لا يوجد وصف'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool(activeTool === 'undo' ? 'select' : 'undo')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'undo' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700/50 text-slate-400'
            }`}
            title="تراجع"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTool(activeTool === 'redo' ? 'select' : 'redo')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'redo' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700/50 text-slate-400'
            }`}
            title="إعادة"
          >
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2" />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white font-medium"
          >
            <Save className="w-4 h-4" />
            <span>حفظ</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors text-white font-medium"
          >
            تصدير
          </button>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <LeftToolbar />

        {/* Center Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Preview */}
          <div className="flex-1 p-4 overflow-hidden">
            <VideoPreview
              isPlaying={isPlaying}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
            />
          </div>

          {/* Timeline */}
          <div className="h-64 bg-slate-800/30 border-t border-slate-700/50">
            <Timeline
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-slate-800/30 border-r border-slate-700/50 overflow-y-auto">
          {getPanelContent()}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4 py-4 bg-slate-800/50 border-t border-slate-700/50 backdrop-blur-sm">
        <button
          onClick={() => setCurrentTime(0)}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400"
        >
          <span className="text-sm font-mono">00:00</span>
        </button>
        <button
          onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400"
        >
          <span className="text-sm font-mono">-5s</span>
        </button>
        <button
          onClick={togglePlayback}
          className="p-4 bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors text-white"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={() => setCurrentTime(currentTime + 5)}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400"
        >
          <span className="text-sm font-mono">+5s</span>
        </button>
        <div className="font-mono text-slate-400 text-lg">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
}

export default EditorPage;
