import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, FileText, Image as ImageIcon, MoreVertical } from 'lucide-react';

interface ClipProps {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  startTime: number;
  duration: number;
  thumbnail?: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
  onResize?: (id: string, edge: 'left' | 'right', newDuration: number) => void;
  onMove?: (id: string, newStartTime: number) => void;
}

const Clip: React.FC<ClipProps> = ({
  id,
  name,
  type,
  startTime,
  duration,
  thumbnail,
  isSelected = false,
  onClick,
  onDoubleClick,
  onResize,
  onMove,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const clipRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStartX(e.clientX);
      e.preventDefault();
    }
  };

  const handleResizeStart = (e: React.MouseEvent, edge: 'left' | 'right') => {
    e.stopPropagation();
    setIsResizing(edge);
    setDragStartX(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && onMove) {
        const delta = (e.clientX - dragStartX) / 30; // Assuming 30px per second
        onMove(id, startTime + delta);
      }

      if (isResizing && onResize) {
        const delta = (e.clientX - dragStartX) / 30;
        const newDuration = isResizing === 'right'
          ? duration + delta
          : duration - delta;
        if (newDuration > 0.5) {
          onResize(id, isResizing, newDuration);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStartX, id, startTime, duration, onMove, onResize]);

  const getTypeColor = () => {
    switch (type) {
      case 'video': return 'from-blue-600/80 to-blue-800/80';
      case 'audio': return 'from-emerald-600/80 to-emerald-800/80';
      case 'subtitle': return 'from-amber-600/80 to-amber-800/80';
      case 'image': return 'from-purple-600/80 to-purple-800/80';
      default: return 'from-slate-600/80 to-slate-800/80';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'video': return Play;
      case 'audio': return Volume2;
      case 'subtitle': return FileText;
      case 'image': return ImageIcon;
      default: return Play;
    }
  };

  const Icon = getTypeIcon();

  return (
    <div
      ref={clipRef}
      onClick={() => onClick?.(id)}
      onDoubleClick={() => onDoubleClick?.(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      className={`absolute top-1 bottom-1 rounded-lg cursor-pointer overflow-hidden transition-all bg-gradient-to-r ${getTypeColor()} ${
        isSelected
          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900'
          : ''
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        width: `${duration * 30}px`, // Assuming 30px per second
      }}
    >
      {/* Clip Content */}
      <div className="h-full px-2 flex items-center justify-center relative">
        {thumbnail && (
          <div className="absolute inset-0 opacity-30">
            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10 flex items-center gap-2">
          <Icon className="w-3 h-3 text-white/80 flex-shrink-0" />
          <span className="text-xs text-white/90 truncate select-none">{name}</span>
        </div>
      </div>

      {/* Resize Handle (Left) */}
      {(isHovered || isSelected) && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize hover:bg-emerald-400 transition-colors z-20"
          onMouseDown={(e) => handleResizeStart(e, 'left')}
        />
      )}

      {/* Resize Handle (Right) */}
      {(isHovered || isSelected) && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize hover:bg-emerald-400 transition-colors z-20"
          onMouseDown={(e) => handleResizeStart(e, 'right')}
        />
      )}

      {/* Duration Badge */}
      {(isHovered || isSelected) && (
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-mono">
          {duration.toFixed(1)}s
        </div>
      )}

      {/* More Options */}
      {(isHovered || isSelected) && (
        <button className="absolute top-1 left-1 p-0.5 hover:bg-black/50 rounded transition-colors z-20">
          <MoreVertical className="w-3 h-3 text-white/80" />
        </button>
      )}
    </div>
  );
};

export default Clip;
