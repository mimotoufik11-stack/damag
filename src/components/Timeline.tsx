import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Plus, Layers, Copy, Trash2, Scissors } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  clips: Clip[];
  height: number;
  color: string;
}

interface Clip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  thumbnail?: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
}

interface TimelineProps {
  currentTime: number;
  onTimeChange: (time: number) => void;
  duration?: number;
}

const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  onTimeChange,
  duration = 60,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1); // pixels per second
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'فيديو',
      type: 'video',
      clips: [
        { id: '1-1', name: 'intro.mp4', startTime: 0, duration: 10, type: 'video' },
        { id: '1-2', name: 'main.mp4', startTime: 12, duration: 20, type: 'video' },
      ],
      height: 60,
      color: 'from-blue-600/80 to-blue-800/80',
    },
    {
      id: '2',
      name: 'صوت',
      type: 'audio',
      clips: [
        { id: '2-1', name: 'background.mp3', startTime: 0, duration: 35, type: 'audio' },
        { id: '2-2', name: 'voice.mp3', startTime: 5, duration: 15, type: 'audio' },
      ],
      height: 50,
      color: 'from-emerald-600/80 to-emerald-800/80',
    },
    {
      id: '3',
      name: 'ترجمة',
      type: 'subtitle',
      clips: [
        { id: '3-1', name: 'سورة الفاتحة', startTime: 0, duration: 5, type: 'subtitle' },
        { id: '3-2', name: 'آية 1-3', startTime: 6, duration: 8, type: 'subtitle' },
      ],
      height: 40,
      color: 'from-amber-600/80 to-amber-800/80',
    },
    {
      id: '4',
      name: 'صور',
      type: 'image',
      clips: [
        { id: '4-1', name: 'background.png', startTime: 0, duration: 35, type: 'image' },
      ],
      height: 45,
      color: 'from-purple-600/80 to-purple-800/80',
    },
  ]);

  const pixelsPerSecond = zoom;
  const totalWidth = duration * pixelsPerSecond;

  const handleTimeRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / pixelsPerSecond;
    onTimeChange(Math.max(0, Math.min(duration, time)));
  };

  const handleClipClick = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    setSelectedClip(clipId);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${mins}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const playheadPosition = currentTime * pixelsPerSecond;

  return (
    <div className="h-full flex flex-col bg-slate-900/50" dir="rtl">
      {/* Timeline Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-700/50 rounded transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4 text-slate-400" />
          </button>
          <div className="w-24 px-2 py-1 bg-slate-700/50 rounded text-center text-sm text-slate-300">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-700/50 rounded transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-700/50 rounded transition-colors" title="إضافة مقطع">
            <Plus className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-1.5 hover:bg-slate-700/50 rounded transition-colors" title="تكرار">
            <Copy className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-1.5 hover:bg-slate-700/50 rounded transition-colors" title="قص">
            <Scissors className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-1.5 hover:bg-slate-700/50 rounded transition-colors" title="حذف">
            <Trash2 className="w-4 h-4 text-slate-400" />
          </button>
          <div className="w-px h-5 bg-slate-700 mx-2" />
          <button className="p-1.5 hover:bg-slate-700/50 rounded transition-colors" title="إضافة مسار">
            <Layers className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Labels */}
        <div className="w-32 flex-shrink-0 bg-slate-800/30 border-l border-slate-700/50 overflow-y-auto">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`h-[${track.height}px] flex items-center justify-between px-3 border-b border-slate-700/30 ${
                selectedClip ? 'opacity-50' : ''
              }`}
              style={{ height: track.height }}
            >
              <span className="text-sm text-slate-300 truncate">{track.name}</span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: track.color.split(' ')[1]?.split('-')[1] || '#fff' }}
              />
            </div>
          ))}
        </div>

        {/* Timeline Tracks */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-auto"
          onClick={handleTimeRulerClick}
        >
          <div style={{ width: totalWidth, minWidth: '100%' }}>
            {/* Time Ruler */}
            <div className="h-8 bg-slate-800/50 border-b border-slate-700/50 relative">
              {Array.from({ length: Math.ceil(duration) }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full flex flex-col items-center"
                  style={{ right: `${i * pixelsPerSecond}px` }}
                >
                  <div className="h-3 w-px bg-slate-600" />
                  <span className="text-xs text-slate-500 mt-0.5">{i}s</span>
                  {i % 5 === 0 && <div className="h-full w-px bg-slate-700/50 absolute top-0 right-0" />}
                </div>
              ))}

              {/* Playhead */}
              <div
                className="absolute top-0 h-full w-0.5 bg-emerald-500 z-10"
                style={{ right: `${playheadPosition}px` }}
              >
                <div className="absolute -top-1 -right-1.5 w-3 h-3 bg-emerald-500 transform rotate-45" />
              </div>
            </div>

            {/* Tracks */}
            <div className="relative">
              {tracks.map((track, trackIndex) => (
                <div
                  key={track.id}
                  className={`relative border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors ${
                    selectedClip ? 'opacity-50' : ''
                  }`}
                  style={{ height: track.height }}
                >
                  {track.clips.map((clip) => (
                    <div
                      key={clip.id}
                      onClick={(e) => handleClipClick(e, clip.id)}
                      className={`absolute top-1 bottom-1 rounded-lg cursor-pointer overflow-hidden transition-all ${
                        selectedClip === clip.id
                          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900'
                          : 'hover:brightness-110'
                      } bg-gradient-to-r ${track.color}`}
                      style={{
                        right: `${clip.startTime * pixelsPerSecond}px`,
                        width: `${clip.duration * pixelsPerSecond}px`,
                      }}
                    >
                      <div className="h-full px-2 flex items-center justify-center">
                        <span className="text-xs text-white/90 truncate text-center">
                          {clip.name}
                        </span>
                      </div>

                      {/* Resize handles */}
                      {selectedClip === clip.id && (
                        <>
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize hover:bg-emerald-400" />
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize hover:bg-emerald-400" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-t border-slate-700/50">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">الوقت الحالي:</span>
          <span className="text-lg font-mono text-emerald-400">{formatTime(currentTime)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">المدة:</span>
          <span className="text-lg font-mono text-slate-300">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
