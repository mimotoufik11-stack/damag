import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/editorStore';

interface VideoPreviewProps {
  onTimeUpdate?: (time: number) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentProject, currentTime, playbackState } = useSelector((state: RootState) => state.editor);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Sync playback state
    if (playbackState === 'playing' && !isPlaying) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else if (playbackState === 'paused' && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [playbackState, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Update current time
    if (Math.abs(video.currentTime - currentTime) > 0.1) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleLoadedMetadata = () => {
    setIsLoading(false);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (onTimeUpdate) {
      onTimeUpdate(video.currentTime);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 flex items-center justify-center relative" dir="rtl">
      {!currentProject ? (
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">مرحباً بك في ضمّاج القرآن</h2>
          <p className="text-gray-300 mb-6">قم برفع فيديو Quranic لبدء التحرير</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            رفع فيديو
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={currentProject.videoPath}
            className="max-w-full max-h-full"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            preload="metadata"
            controls
          />

          {/* Subtitle Overlay */}
          {currentProject.subtitles.map((track) => 
            track.visible && track.subtitles.map((subtitle) => {
              const isActive = currentTime >= subtitle.start && currentTime <= subtitle.end;
              if (!isActive) return null;

              return (
                <div
                  key={subtitle.id}
                  className="absolute left-1/2 transform -translate-x-1/2"
                  style={{
                    bottom: subtitle.style.position === 'bottom' ? '10%' : 
                           subtitle.style.position === 'top' ? '10%' : '50%',
                    top: subtitle.style.position === 'center' ? '50%' : undefined,
                    color: subtitle.style.color,
                    fontSize: subtitle.style.fontSize,
                    fontFamily: subtitle.style.font,
                    fontWeight: subtitle.style.opacity > 0.5 ? 'bold' : 'normal',
                    textShadow: subtitle.style.shadow.enabled
                      ? `${subtitle.style.shadow.offsetX}px ${subtitle.style.shadow.offsetY}px ${subtitle.style.shadow.blur}px ${subtitle.style.shadow.color}`
                      : 'none',
                    WebkitTextStroke: subtitle.style.stroke.width > 0
                      ? `${subtitle.style.stroke.width}px ${subtitle.style.stroke.color}`
                      : 'none',
                    backgroundColor: subtitle.style.background.enabled
                      ? subtitle.style.background.color + Math.round(subtitle.style.background.opacity * 255).toString(16).padStart(2, '0')
                      : 'transparent',
                    padding: subtitle.style.background.enabled ? '8px 16px' : '0',
                    borderRadius: subtitle.style.background.enabled ? '8px' : '0',
                  }}
                >
                  <div>{subtitle.verse?.text || subtitle.text}</div>
                  {subtitle.verse?.translation && (
                    <div className="text-sm mt-1 text-gray-200">
                      {subtitle.verse.translation}
                    </div>
                  )}
                </div>
              );
  }
)}

          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-xl">جاري التحميل...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPreview;