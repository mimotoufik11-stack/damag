import { useState, useCallback, useRef } from 'react';

interface Clip {
  id: string;
  trackId: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  startTime: number;
  duration: number;
  thumbnail?: string;
}

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'subtitle' | 'image';
  clips: Clip[];
  height: number;
}

export const useTimeline = (initialTracks?: Track[]) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks || []);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();

  const addClip = useCallback((trackId: string, clip: Omit<Clip, 'id'>) => {
    const newClip: Clip = {
      ...clip,
      id: `clip_${Date.now()}`,
    };
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId
          ? { ...track, clips: [...track.clips, newClip] }
          : track
      )
    );
  }, []);

  const removeClip = useCallback((clipId: string) => {
    setTracks(prev =>
      prev.map(track => ({
        ...track,
        clips: track.clips.filter(clip => clip.id !== clipId),
      }))
    );
    if (selectedClip === clipId) setSelectedClip(null);
  }, [selectedClip]);

  const moveClip = useCallback((clipId: string, newStartTime: number) => {
    setTracks(prev =>
      prev.map(track => ({
        ...track,
        clips: track.clips.map(clip =>
          clip.id === clipId ? { ...clip, startTime: newStartTime } : clip
        ),
      }))
    );
  }, []);

  const resizeClip = useCallback((clipId: string, newDuration: number) => {
    setTracks(prev =>
      prev.map(track => ({
        ...track,
        clips: track.clips.map(clip =>
          clip.id === clipId ? { ...clip, duration: newDuration } : clip
        ),
      }))
    );
  }, []);

  const splitClip = useCallback((clipId: string, splitTime: number) => {
    setTracks(prev =>
      prev.map(track => {
        const clipIndex = track.clips.findIndex(c => c.id === clipId);
        if (clipIndex === -1) return track;

        const clip = track.clips[clipIndex];
        const relativeTime = splitTime - clip.startTime;

        if (relativeTime <= 0 || relativeTime >= clip.duration) return track;

        const leftClip = {
          ...clip,
          duration: relativeTime,
          id: `${clip.id}_left`,
        };
        const rightClip = {
          ...clip,
          startTime: splitTime,
          duration: clip.duration - relativeTime,
          id: `${clip.id}_right`,
        };

        const newClips = [
          ...track.clips.slice(0, clipIndex),
          leftClip,
          rightClip,
          ...track.clips.slice(clipIndex + 1),
        ];

        return { ...track, clips: newClips };
      })
    );
  }, []);

  const duplicateClip = useCallback((clipId: string) => {
    setTracks(prev =>
      prev.map(track => {
        const clip = track.clips.find(c => c.id === clipId);
        if (!clip) return track;

        const newClip: Clip = {
          ...clip,
          id: `clip_${Date.now()}`,
          startTime: clip.startTime + clip.duration + 0.1,
        };

        return { ...track, clips: [...track.clips, newClip] };
      })
    );
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const stop = useCallback(() => {
    pause();
    setCurrentTime(0);
  }, [pause]);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return {
    tracks,
    currentTime,
    selectedClip,
    zoom,
    isPlaying,
    addClip,
    removeClip,
    moveClip,
    resizeClip,
    splitClip,
    duplicateClip,
    play,
    pause,
    stop,
    seek,
    setCurrentTime,
    setSelectedClip,
    setZoom,
    setIsPlaying,
  };
};
