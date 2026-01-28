import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setCurrentTime } from '../store/editorStore';

interface TimelineProps {
  onClipSelect?: (clipId: string) => void;
  onTimeChange?: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ onClipSelect, onTimeChange }) => {
  const { currentProject, currentTime, selectedTrackId } = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const pixelsPerSecond = 50 * zoom;
  const timelineDuration = currentProject?.duration || 60;
  const timelineWidth = timelineDuration * pixelsPerSecond;

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(timelineDuration, x / pixelsPerSecond));

    dispatch(setCurrentTime(newTime));
    if (onTimeChange) {
      onTimeChange(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Auto-advance playhead
      const interval = setInterval(() => {
        if (currentTime < timelineDuration) {
          dispatch(setCurrentTime(currentTime + 0.1));
        } else {
          clearInterval(interval);
          setIsPlaying(false);
        }
      }, 100);

      setTimeout(() => {
        if (!isPlaying) {
          clearInterval(interval);
        }
      }, (timelineDuration - currentTime) * 1000);
    }
  };

  return (
    <div className="bg-gray-800 text-white h-96 flex flex-col" dir="rtl">
      {/* Timeline Header */}
      <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <span className="font-mono">{formatTime(currentTime)}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <span className="text-sm">التكبير:</span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24"
            />
          </label>
          
          <span className="text-sm">
            {currentProject?.subtitles?.length || 0} مسارات
          </span>
        </div>
      </div>

      {/* Timeline Ruler */}
      <div className="bg-gray-750 h-8 relative border-b border-gray-600">
        <div 
          className="absolute inset-0"
          style={{ width: `${timelineWidth}px` }}
        >
          {Array.from({ length: Math.ceil(timelineDuration) + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-gray-500"
              style={{ left: `${i * pixelsPerSecond}px` }}
            >
              <span className="text-xs ml-2">{formatTime(i)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 overflow-auto" ref={timelineRef} onClick={handleTimelineClick}>
        <div style={{ width: `${timelineWidth}px`, minHeight: '100%' }}>
          {/* Subtitle Tracks */}
          {currentProject?.subtitles.map((track, trackIndex) => (
            <div
              key={track.id}
              className={`h-20 border-b border-gray-700 flex items-center px-2 ${
                selectedTrackId === track.id ? 'bg-blue-900 bg-opacity-30' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                // dispatch actions to select track
              }}
            >
              <div className="w-32 px-2 text-sm truncate">
                {track.name}
              </div>
              <div className="flex-1 relative h-full">
                {track.subtitles.map((subtitle) => {
                  const left = subtitle.start * pixelsPerSecond;
                  const width = (subtitle.end - subtitle.start) * pixelsPerSecond;
                  const isSelected = false; // TODO: track selected subtitle

                  return (
                    <div
                      key={subtitle.id}
                      className={`absolute top-2 h-12 rounded cursor-pointer flex items-center px-2 text-xs ${
                        isSelected
                          ? 'bg-blue-600'
                          : 'bg-green-600 hover:bg-green-500'
                      }`}
                      style={{
                        left: `${left}px`,
                        width: `${width}px`,
                      }}
                      title={subtitle.text}
                    >
                      <div className="truncate">
                        {subtitle.verse?.text || subtitle.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-red-500 z-20"
            style={{ left: `${currentTime * pixelsPerSecond}px` }}
          >
            <div className="absolute -top-2 -left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500" />
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="text-xs px-2 py-1 hover:bg-gray-600 rounded">🔪 قص</button>
          <button className="text-xs px-2 py-1 hover:bg-gray-600 rounded">📋 نسخ</button>
          <button className="text-xs px-2 py-1 hover:bg-gray-600 rounded">📌 لصق</button>
          <button className="text-xs px-2 py-1 hover:bg-gray-600 rounded">🗑️ حذف</button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 rounded">
            ➕ إضافة آية
          </button>
          <button className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded">
            ✨ تأثيرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;