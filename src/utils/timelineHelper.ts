import { Clip, Track } from '../types/timeline';

/**
 * Find clips at a specific time
 */
export function findClipsAtTime(tracks: Track[], time: number): Clip[] {
  const clips: Clip[] = [];
  
  for (const track of tracks) {
    for (const clip of track.clips) {
      if (time >= clip.startTime && time <= clip.startTime + clip.duration) {
        clips.push(clip);
      }
    }
  }

  return clips;
}

/**
 * Find overlapping clips
 */
export function findOverlappingClips(clip: Clip, track: Track): Clip[] {
  return track.clips.filter(
    (c) =>
      c.id !== clip.id &&
      ((c.startTime >= clip.startTime && c.startTime < clip.startTime + clip.duration) ||
        (clip.startTime >= c.startTime && clip.startTime < c.startTime + c.duration))
  );
}

/**
 * Calculate total duration of timeline
 */
export function calculateTotalDuration(tracks: Track[]): number {
  let maxEnd = 0;

  for (const track of tracks) {
    for (const clip of track.clips) {
      const clipEnd = clip.startTime + clip.duration;
      if (clipEnd > maxEnd) {
        maxEnd = clipEnd;
      }
    }
  }

  return maxEnd;
}

/**
 * Snap time to nearest grid
 */
export function snapToGrid(time: number, gridSize: number): number {
  return Math.round(time / gridSize) * gridSize;
}

/**
 * Check if clips are selected
 */
export function areClipsSelected(selectedIds: string[]): boolean {
  return selectedIds.length > 0;
}

/**
 * Get selected clips
 */
export function getSelectedClips(tracks: Track[], selectedIds: string[]): Clip[] {
  const clips: Clip[] = [];

  for (const track of tracks) {
    for (const clip of track.clips) {
      if (selectedIds.includes(clip.id)) {
        clips.push(clip);
      }
    }
  }

  return clips;
}

/**
 * Move clips by delta time
 */
export function moveClipsByDelta(
  clips: Clip[],
  delta: number,
  minTime: number = 0
): Clip[] {
  return clips.map((clip) => ({
    ...clip,
    startTime: Math.max(minTime, clip.startTime + delta),
  }));
}

/**
 * Resize clips by delta duration
 */
export function resizeClipsByDelta(
  clips: Clip[],
  delta: number,
  minDuration: number = 0.5
): Clip[] {
  return clips.map((clip) => ({
    ...clip,
    duration: Math.max(minDuration, clip.duration + delta),
  }));
}

/**
 * Split clip at time
 */
export function splitClip(clip: Clip, splitTime: number): [Clip, Clip] | null {
  const relativeTime = splitTime - clip.startTime;

  if (relativeTime <= 0 || relativeTime >= clip.duration) {
    return null;
  }

  const leftClip: Clip = {
    ...clip,
    id: `${clip.id}_left`,
    duration: relativeTime,
  };

  const rightClip: Clip = {
    ...clip,
    id: `${clip.id}_right`,
    startTime: splitTime,
    duration: clip.duration - relativeTime,
  };

  return [leftClip, rightClip];
}

/**
 * Merge adjacent clips
 */
export function mergeClips(clips: Clip[]): Clip | null {
  if (clips.length < 2) {
    return null;
  }

  const sortedClips = [...clips].sort((a, b) => a.startTime - b.startTime);

  // Check if clips are adjacent
  for (let i = 1; i < sortedClips.length; i++) {
    if (sortedClips[i].startTime !== sortedClips[i - 1].startTime + sortedClips[i - 1].duration) {
      return null;
    }
  }

  const mergedClip: Clip = {
    ...sortedClips[0],
    id: `${sortedClips[0].id}_merged`,
    duration: sortedClips.reduce((sum, clip) => sum + clip.duration, 0),
  };

  return mergedClip;
}

/**
 * Calculate clip width in pixels
 */
export function calculateClipWidth(clip: Clip, pixelsPerSecond: number): number {
  return clip.duration * pixelsPerSecond;
}

/**
 * Calculate clip position in pixels
 */
export function calculateClipPosition(clip: Clip, pixelsPerSecond: number): number {
  return clip.startTime * pixelsPerSecond;
}

/**
 * Calculate time from pixel position
 */
export function timeFromPixels(pixels: number, pixelsPerSecond: number): number {
  return pixels / pixelsPerSecond;
}

/**
 * Convert time to percentage of timeline duration
 */
export function timeToPercentage(time: number, duration: number): number {
  if (duration === 0) return 0;
  return (time / duration) * 100;
}

/**
 * Convert percentage to time
 */
export function percentageToTime(percentage: number, duration: number): number {
  return (percentage / 100) * duration;
}

/**
 * Check if clip is within view
 */
export function isClipInView(
  clip: Clip,
  viewStart: number,
  viewEnd: number
): boolean {
  const clipEnd = clip.startTime + clip.duration;
  return clip.startTime < viewEnd && clipEnd > viewStart;
}

/**
 * Get visible clips in time range
 */
export function getVisibleClips(tracks: Track[], viewStart: number, viewEnd: number): Clip[] {
  const clips: Clip[] = [];

  for (const track of tracks) {
    for (const clip of track.clips) {
      if (isClipInView(clip, viewStart, viewEnd)) {
        clips.push(clip);
      }
    }
  }

  return clips;
}

/**
 * Validate clip placement
 */
export function validateClipPlacement(
  clip: Clip,
  track: Track,
  allowOverlap: boolean = true
): { valid: boolean; error?: string } {
  if (clip.startTime < 0) {
    return { valid: false, error: 'Clip cannot start before timeline start' };
  }

  if (clip.duration <= 0) {
    return { valid: false, error: 'Clip duration must be positive' };
  }

  if (!allowOverlap) {
    const overlaps = findOverlappingClips(clip, track);
    if (overlaps.length > 0) {
      return { valid: false, error: 'Clip overlaps with other clips' };
    }
  }

  return { valid: true };
}

/**
 * Calculate gap between clips
 */
export function calculateGap(clip1: Clip, clip2: Clip): number {
  const end1 = clip1.startTime + clip1.duration;
  const start2 = clip2.startTime;
  return start2 - end1;
}

/**
 * Find gaps in track
 */
export function findGaps(track: Track, duration: number): Array<{ start: number; end: number }> {
  const sortedClips = [...track.clips].sort((a, b) => a.startTime - b.startTime);
  const gaps: Array<{ start: number; end: number }> = [];
  let currentTime = 0;

  for (const clip of sortedClips) {
    if (clip.startTime > currentTime) {
      gaps.push({ start: currentTime, end: clip.startTime });
    }
    currentTime = Math.max(currentTime, clip.startTime + clip.duration);
  }

  if (currentTime < duration) {
    gaps.push({ start: currentTime, end: duration });
  }

  return gaps;
}

/**
 * Auto-arrange clips without overlap
 */
export function autoArrangeClips(clips: Clip[], padding: number = 0.1): Clip[] {
  const sortedClips = [...clips].sort((a, b) => a.startTime - b.startTime);
  const arrangedClips: Clip[] = [];
  let currentTime = 0;

  for (const clip of sortedClips) {
    arrangedClips.push({
      ...clip,
      startTime: currentTime,
    });
    currentTime += clip.duration + padding;
  }

  return arrangedClips;
}
