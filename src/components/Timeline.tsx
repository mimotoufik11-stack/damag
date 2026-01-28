import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoClip, SubtitleEntry, VideoEffect, AudioTrack } from '../store/editorStore';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Divider,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  PlayArrow,
  Pause,
  Delete,
  ContentCut,
  ContentCopy,
  VolumeUp,
  Videocam,
  Subtitles,
  Brush,
  MusicNote,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

interface TimelineProps {
  time: number;
  videoClips: VideoClip[];
  subtitles: SubtitleEntry[];
  effects: VideoEffect[];
  audioTracks: AudioTrack[];
  duration: number;
  onTimeChange: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  time,
  videoClips,
  subtitles,
  effects,
  audioTracks,
  duration,
  onTimeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<'video' | 'subtitle' | 'effect' | 'audio'>('video');
  const [clipHeight, setClipHeight] = useState(32);
  const [trackLocked, setTrackLocked] = useState({
    video: false,
    subtitle: false,
    effects: false,
    audio: true,
  });
  const [trackVisible, setTrackVisible] = useState({
    video: true,
    subtitle: true,
    effects: true,
    audio: false,
  });

  const tracks = [
    {
      type: 'video' as const,
      name: 'Video Track',
      icon: <Videocam fontSize="small" />,
      items: videoClips,
      height: clipHeight,
      color: '#4CAF50',
    },
    {
      type: 'subtitle' as const,
      name: 'Subtitle Track',
      icon: <Subtitles fontSize="small" />,
      items: subtitles,
      height: clipHeight - 8,
      color: '#2196F3',
    },
    {
      type: 'effect' as const,
      name: 'Effects Track',
      icon: <Brush fontSize="small" />,
      items: effects,
      height: clipHeight - 8,
      color: '#9C27B0',
    },
    {
      type: 'audio' as const,
      name: 'Audio Track',
      icon: <MusicNote fontSize="small" />,
      items: audioTracks,
      height: clipHeight,
      color: '#FF9800',
    },
  ];

  const pixelsPerSecond = 50 * zoom;
  const [timelineWidth, setTimelineWidth] = useState(800);

  useEffect(() => {
    const updateWidth = () => {
      const containerWidth = containerRef.current?.clientWidth || 800;
      setTimelineWidth(Math.max(duration * pixelsPerSecond, containerWidth));
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [duration, pixelsPerSecond]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedTime = (x / pixelsPerSecond);
    
    onTimeChange(Math.max(0, Math.min(clickedTime, duration)));
  };

  const handleClipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.5, 0.1));
  };

  const handleZoomFit = React.useCallback(() => {
    if (containerRef.current && duration > 0) {
      const containerWidth = containerRef.current.clientWidth - 64; // Account for track labels
      const targetZoom = containerWidth / (duration * 50);
      setZoom(Math.max(0.1, Math.min(1, targetZoom)));
    }
  }, [duration]);

  useEffect(() => {
    handleZoomFit();
  }, [handleZoomFit]);

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderTop: '1px solid #e0e0e0',
      backgroundColor: '#fafafa'
    }}>
      {/* Timeline Controls */}
      <Box sx={{ 
        height: 40, 
        display: 'flex', 
        alignItems: 'center', 
        px: 2, 
        gap: 2,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white'
      }}>
        <Typography variant="subtitle2">Timeline:</Typography>
        
        <Button size="small" startIcon={<ZoomOut />} onClick={handleZoomOut}>
          Zoom Out
        </Button>
        
        <Slider
          value={zoom}
          onChange={(_, value) => setZoom(value as number)}
          min={0.1}
          max={5}
          step={0.1}
          valueLabelDisplay="off"
          sx={{ width: 150 }}
        />
        
        <Button size="small" startIcon={<ZoomIn />} onClick={handleZoomIn}>
          Zoom In
        </Button>
        
        <Button size="small" onClick={handleZoomFit}>
          Fit
        </Button>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <Button size="small" startIcon={<ContentCut />}>
          Cut
        </Button>
        <Button size="small" startIcon={<ContentCopy />}>
          Copy
        </Button>
        <Button size="small">
          Paste
        </Button>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <Button size="small" startIcon={<Delete />} color="error">
          Delete
        </Button>
      </Box>

      {/* Time Ruler */}
      <Box sx={{ 
        height: 24, 
        backgroundColor: '#e3f2fd',
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute', 
          width: timelineWidth,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          borderLeft: '1px solid #ccc'
        }}>
          {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
            <Box 
              key={i} 
              sx={{ 
                width: pixelsPerSecond, 
                height: '100%',
                borderRight: '1px solid #90CAF9',
                position: 'relative'
              }}
            >
              <Typography variant="caption" sx={{ position: 'absolute', left: 2, top: 4 }}>
                {formatTime(i)}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Playhead */}
        <Box sx={{ 
          position: 'absolute', 
          left: time * pixelsPerSecond + 64, // Offset for track label
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#f44336',
          zIndex: 1000,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -4,
            left: -4,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#f44336'
          }
        }} />
      </Box>

      {/* Tracks Container */}
      <Box 
        ref={containerRef}
        sx={{ 
          flexGrow: 1,
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={handleTimelineClick}
      >
        <Box sx={{ minWidth: timelineWidth, display: 'flex' }}>
          {/* Track Labels */}
          <Box sx={{ 
            width: 64, 
            backgroundColor: '#f5f5f5',
            borderRight: '1px solid #e0e0e0'
          }}>
            {tracks.map((track, index) => (
              <Box key={index} sx={{ 
                height: track.height, 
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                pl: 1,
                backgroundColor: trackLocked[track.type] ? '#ffebee' : 'inherit'
              }}>
                {track.icon}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {track.type.charAt(0).toUpperCase()}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Track Content */}
          <Box sx={{ flex: 1 }}>
            {tracks.map((track, index) => (
              <Box key={index} sx={{ 
                height: track.height, 
                borderBottom: '1px solid #e0e0e0',
                position: 'relative',
                backgroundColor: '#ffffff'
              }}>
                {/* Track visibility toggle */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: -44, 
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10
                }}>
                  <Box component="span" onClick={() => setTrackVisible(prev => ({ ...prev, [track.type]: !prev[track.type] }))}>
                    {trackVisible[track.type] ? 
                      <Visibility fontSize="small" /> : 
                      <VisibilityOff fontSize="small" />
                    }
                  </Box>
                  <Box component="span" onClick={() => setTrackLocked(prev => ({ ...prev, [track.type]: !prev[track.type] }))} sx={{ ml: 0.5 }}>
                    <Lock fontSize="small" style={{ opacity: trackLocked[track.type] ? 1 : 0.3 }} />
                  </Box>
                </Box>

                {/* Clips */}
                {track.items.map((item: any, itemIndex: number) => {
                  const width = (item.duration || 5) * pixelsPerSecond;
                  const left = (item.startTime || 0) * pixelsPerSecond;
                  
                  return (
                    <Box
                      key={itemIndex}
                      onClick={(e) => handleClipClick(e, item.id || itemIndex)}
                      sx={{
                        position: 'absolute',
                        left,
                        top: 2,
                        width,
                        height: track.height - 4,
                        backgroundColor: track.color,
                        borderRadius: 1,
                        display: trackVisible[track.type] ? 'flex' : 'none',
                        alignItems: 'center',
                        pl: 1,
                        cursor: trackLocked[track.type] ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-1px)'
                        },
                        border: selectedTrack === track.type ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'white',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.name || (track.type === 'subtitle' ? (item.arabicText || item.text) : `Clip ${itemIndex + 1}`)}
                      </Typography>
                    </Box>
                  );
                })}

                {/* Empty track indicator */}
                {track.items.length === 0 && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      position: 'absolute', 
                      left: 8, 
                      top: '50%', 
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {trackLocked[track.type] ? 'Track Locked' : `Empty ${track.name}`}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Track Info Panel */}
      <Box sx={{ 
        height: 60, 
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2,
        backgroundColor: 'white'
      }}>
        <Typography variant="body2">
          Duration: {duration.toFixed(2)}s
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Chip 
          label={`Clips: ${videoClips.length}`} 
          size="small" 
          color="success" 
          variant="outlined" 
        />
        <Chip 
          label={`Subtitles: ${subtitles.length}`} 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label={`Effects: ${effects.length}`} 
          size="small" 
          color="secondary" 
          variant="outlined" 
        />
      </Box>
    </Box>
  );
};

export default Timeline;
