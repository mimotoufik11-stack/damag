import React, { useRef } from 'react';
import { GripVertical, MoreVertical } from 'lucide-react';

interface Clip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  color?: string;
  thumbnail?: string;
}

interface TimelineTrackProps {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  clips: Clip[];
  height?: number;
  pixelsPerSecond: number;
  selectedClipId?: string | null;
  onClipClick?: (clipId: string) => void;
  onClipMove?: (clipId: string, newStartTime: number) => void;
  onClipResize?: (clipId: string, newDuration: number) => void;
}

const TimelineTrack: React.FC<TimelineTrackProps> = ({
  id,
  name,
  type,
  clips,
  height = 60,
  pixelsPerSecond,
  selectedClipId,
  onClipClick,
  onClipMove,
  onClipResize,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const getTrackColor = () => {
    switch (type) {
      case 'video': return 'from-blue-600/80 to-blue-800/80';
      case 'audio': return 'from-emerald-600/80 to-emerald-800/80';
      case 'subtitle': return 'from-amber-600/80 to-amber-800/80';
      case 'image': return 'from-purple-600/80 to-purple-800/80';
      default: return 'from-slate-600/80 to-slate-800/80';
    }
  };

  const handleDragStart = (e: React.DragEvent, clipId: string) => {
    e.dataTransfer.setData('clipId', clipId);
    e.dataTransfer.setData('trackId', id);
    e.dataTransfer.setData('trackType', type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceClipId = e.dataTransfer.getData('clipId');
    const sourceTrackId = e.dataTransfer.getData('trackId');

    if (sourceClipId === id || sourceTrackId === id) return;

    const rect = trackRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const newStartTime = x / pixelsPerSecond;
      onClipMove?.(sourceClipId, newStartTime);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={trackRef}
      className={`relative h-[${height}px] border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors`}
      style={{ height }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {clips.map((clip) => (
        <div
          key={clip.id}
          draggable
          onDragStart={(e) => handleDragStart(e, clip.id)}
          onClick={() => onClipClick?.(clip.id)}
          className={`absolute top-1 bottom-1 rounded-lg cursor-pointer overflow-hidden transition-all bg-gradient-to-r ${clip.color || getTrackColor()} ${
            selectedClipId === clip.id
              ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900'
              : 'hover:brightness-110'
          }`}
          style={{
            right: `${clip.startTime * pixelsPerSecond}px`,
            width: `${clip.duration * pixelsPerSecond}px`,
          }}
        >
          {/* Clip Content */}
          <div className="h-full px-2 flex items-center justify-center group">
            <span className="text-xs text-white/90 truncate text-center select-none">
              {clip.name}
            </span>
          </div>

          {/* Resize Handle (Left) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize hover:bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
            onDoubleClick={(e) => {
              e.stopPropagation();
              // Handle left resize
            }}
          />

          {/* Resize Handle (Right) */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize hover:bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
            onDoubleClick={(e) => {
              e.stopPropagation();
              // Handle right resize
            }}
          />

          {/* Drag Handle */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
            <GripVertical className="w-3 h-3 text-white/50" />
          </div>

          {/* More Options */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Show context menu
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-3 h-3 text-white/50" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TimelineTrack;
