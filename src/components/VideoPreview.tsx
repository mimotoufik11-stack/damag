import React, { useEffect, useRef, useState } from 'react';
import { VideoClip, SubtitleEntry, VideoEffect } from '../store/editorStore';
import { Box, Typography } from '@mui/material';

interface VideoPreviewProps {
  time: number;
  videoClips: VideoClip[];
  subtitles: SubtitleEntry[];
  effects: VideoEffect[];
  width: number;
  height: number;
  onTimeChange: (time: number) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  time,
  videoClips,
  subtitles,
  effects,
  width,
  height,
  onTimeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);

  const applyEffectToCanvas = (ctx: CanvasRenderingContext2D, effect: VideoEffect) => {
    const applyFilter = (filter: string) => {
      ctx.filter = filter;
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.filter = 'none';
    };

    switch (effect.type) {
      case 'brightness':
        return () => applyFilter(`brightness(${effect.value}%)`);
      case 'contrast':
        return () => applyFilter(`contrast(${effect.value}%)`);
      case 'saturation':
        return () => applyFilter(`saturate(${effect.value}%)`);
      case 'hue':
        return () => applyFilter(`hue-rotate(${effect.value}deg)`);
      case 'blur':
        return () => applyFilter(`blur(${effect.value}px)`);
      case 'sharpen':
        return () => applyFilter(`contrast(${200 - effect.value}%)`);
      case 'invert':
        return () => applyFilter(`invert(${effect.value}%)`);
      default:
        return null;
    }
  };

  const renderSubtitle = (
    ctx: CanvasRenderingContext2D,
    subtitle: SubtitleEntry,
    canvasWidth: number,
    canvasHeight: number,
    currentTime: number
  ) => {
    // Check if subtitle should be visible at current time
    if (currentTime < subtitle.startTime || currentTime > subtitle.endTime) {
      return;
    }

    // Calculate progress for effects
    const progress = (currentTime - subtitle.startTime) / (subtitle.endTime - subtitle.startTime);
    const effectProgress = subtitle.effect === 'none' ? 1 : Math.min(1, progress * 2);

    // Set up text properties
    ctx.save();
    
    // Calculate position based on position setting
    let y: number;
    switch (subtitle.position) {
      case 'top':
        y = canvasHeight * 0.15;
        break;
      case 'center':
        y = canvasHeight * 0.5;
        break;
      case 'bottom':
      default:
        y = canvasHeight * 0.85;
    }
    
    const x = canvasWidth * 0.5;

    // Apply effect-based position/scaling
    let finalY = y;
    let finalX = x;
    let scale = 1;
    let alpha = 1;

    switch (subtitle.effect) {
      case 'fade':
        alpha = effectProgress;
        break;
      case 'slide':
        finalX = x - (1 - effectProgress) * 100;
        break;
      case 'scale':
        scale = effectProgress;
        break;
      case 'bounce':
        const bounce = Math.sin(effectProgress * Math.PI * 2) * 0.1;
        finalY = y - bounce * 20;
        break;
      case 'pulse':
        scale = 1 + Math.sin(Date.now() * 0.01) * 0.05;
        break;
      case 'typewriter':
        break;
      default:
        break;
    }

    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    // Process colors
    const bgColor = subtitle.background;
    const textColor = subtitle.color;
    
    // Extract text shadow
    const shadowMatch = subtitle.shadow.match(/(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+(.+)/);
    const shadowX = shadowMatch ? parseInt(shadowMatch[1]) : 2;
    const shadowY = shadowMatch ? parseInt(shadowMatch[2]) : 2;
    const shadowBlur = shadowMatch ? parseInt(shadowMatch[3]) : 4;
    const shadowColor = shadowMatch ? shadowMatch[4] : 'rgba(0, 0, 0, 0.7)';

    // Apply text transform
    const textToRender = subtitle.arabicText || subtitle.text || '';
    
    if (scale !== 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.translate(-x, -y);
    }

    // Draw background
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      ctx.fillStyle = bgColor;
      
      const metrics = ctx.measureText(textToRender);
      const textWidth = metrics.width;
      const textHeight = subtitle.fontSize * subtitle.lineHeight;
      
      ctx.fillRect(
        x - textWidth / 2 - 20,
        finalY - textHeight - 10,
        textWidth + 40,
        textHeight + 20
      );
    }

    // Apply styles
    ctx.font = `${subtitle.fontWeight} ${subtitle.fontSize}px ${subtitle.fontFamily}`;
    ctx.fillStyle = textColor;
    
    // Draw stroke
    if (subtitle.stroke && subtitle.stroke !== '#000000') {
      ctx.strokeStyle = subtitle.stroke;
      ctx.lineWidth = subtitle.strokeWidth;
      ctx.strokeText(textToRender, finalX, finalY);
    }

    // Draw shadow
    if (subtitle.shadow) {
      ctx.save();
      ctx.shadowColor = shadowColor;
      ctx.shadowOffsetX = shadowX;
      ctx.shadowOffsetY = shadowY;
      ctx.shadowBlur = shadowBlur;
      ctx.fillText(textToRender, finalX, finalY);
      ctx.restore();
    }

    // Draw glow
    if (subtitle.glow) {
      const glowMatch = subtitle.glow.match(/0\s+0\s+(\d+)px\s+(.+)/);
      if (glowMatch) {
        ctx.save();
        ctx.filter = `blur(${glowMatch[1]}px)`;
        ctx.fillStyle = glowMatch[2];
        ctx.fillText(textToRender, finalX, finalY);
        ctx.restore();
      }
    }

    // Draw main text
    ctx.fillText(textToRender, finalX, finalY);
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Render video frame (placeholder for actual video rendering)
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(0, 0, width, height);

    // Draw video frame placeholder
    if (videoClips.length > 0) {
      const clip = videoClips[0];
      const aspectRatio = clip.width / clip.height;
      
      // Find current frame based on time
      const clipTime = Math.max(0, time - clip.startTime);
      const frame = clipTime * 30; // Assuming 30fps
      
      // Simulate video frame rendering
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, width, height);
      
      // Draw frame info
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Video Frame: ${Math.round(frame)}`, width / 2, height / 2 - 50);
      ctx.fillText(`${clip.name} - ${Math.round(clipTime * 100) / 100}s`, width / 2, height / 2 + 50);
      
      // Draw aspect ratio guide
      if (aspectRatio) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
      }
    } else {
      // No video - show placeholder
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#fff';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📷 No Video Loaded', width / 2, height / 2 - 20);
      ctx.font = '18px Arial';
      ctx.fillText('Click Upload to add video', width / 2, height / 2 + 30);
    }

    // Apply video effects
    effects.forEach(effect => {
      const effectStyle = applyEffectToCanvas(ctx, effect);
      if (effectStyle) {
        ctx.save();
        effectStyle();
        ctx.restore();
      }
    });

    // Render subtitles
    subtitles.forEach(subtitle => {
      renderSubtitle(ctx, subtitle, width, height, time);
    });

    // Render time info
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, 20, 180, 60);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Time: ${time.toFixed(2)}s`, 30, 45);
    ctx.fillText(`Subtitles: ${subtitles.length}`, 30, 65);

  }, [time, videoClips, subtitles, effects, width, height]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * (videoClips.reduce((total, clip) => total + clip.duration, 0) || 60);
    onTimeChange(Math.max(0, time));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleCanvasClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleCanvasClick(e);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prevZoom => Math.max(0.5, Math.min(2, prevZoom * delta)));
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative',
      }}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          transform: `scale(${zoom})`,
          transition: 'transform 0.1s',
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Zoom controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 1,
          padding: '4px 8px',
        }}
      >
        <Typography variant="caption" style={{ color: 'white' }}>
          Zoom: {Math.round(zoom * 100)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default VideoPreview;