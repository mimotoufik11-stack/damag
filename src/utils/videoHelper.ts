/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Calculate height from width and aspect ratio
 */
export function calculateHeight(width: number, aspectRatio: string): number {
  const [w, h] = aspectRatio.split(':').map(Number);
  return (width * h) / w;
}

/**
 * Calculate width from height and aspect ratio
 */
export function calculateWidth(height: number, aspectRatio: string): number {
  const [w, h] = aspectRatio.split(':').map(Number);
  return (height * w) / h;
}

/**
 * Scale dimensions to fit within max dimensions
 */
export function scaleToFit(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = width / height;

  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  if (width / maxWidth > height / maxHeight) {
    return { width: maxWidth, height: maxWidth / aspectRatio };
  } else {
    return { width: maxHeight * aspectRatio, height: maxHeight };
  }
}

/**
 * Scale dimensions to cover min dimensions
 */
export function scaleToCover(
  width: number,
  height: number,
  minWidth: number,
  minHeight: number
): { width: number; height: number } {
  const aspectRatio = width / height;

  if (width >= minWidth && height >= minHeight) {
    return { width, height };
  }

  if (width / minWidth < height / minHeight) {
    return { width: minWidth, height: minWidth / aspectRatio };
  } else {
    return { width: minHeight * aspectRatio, height: minHeight };
  }
}

/**
 * Convert frame index to time
 */
export function frameToTime(frame: number, fps: number): number {
  return frame / fps;
}

/**
 * Convert time to frame index
 */
export function timeToFrame(time: number, fps: number): number {
  return Math.floor(time * fps);
}

/**
 * Calculate bitrate for target file size
 */
export function calculateBitrate(
  fileSize: number,
  duration: number,
  audioBitrate: number = 128000
): number {
  const totalBits = fileSize * 8;
  const audioBits = audioBitrate * duration;
  const videoBits = totalBits - audioBits;
  return Math.floor(videoBits / duration);
}

/**
 * Estimate file size from bitrate and duration
 */
export function estimateFileSize(
  videoBitrate: number,
  audioBitrate: number,
  duration: number
): number {
  const totalBits = (videoBitrate + audioBitrate) * duration;
  return totalBits / 8; // bytes
}

/**
 * Get video codec info
 */
export function getCodecInfo(codec: string): { name: string; quality: string } {
  const codecs: Record<string, { name: string; quality: string }> = {
    h264: { name: 'H.264', quality: 'Good' },
    h265: { name: 'H.265/HEVC', quality: 'Excellent' },
    vp9: { name: 'VP9', quality: 'Good' },
    av1: { name: 'AV1', quality: 'Excellent' },
    mpeg4: { name: 'MPEG-4', quality: 'Fair' },
  };

  return codecs[codec.toLowerCase()] || { name: codec, quality: 'Unknown' };
}

/**
 * Get recommended settings for resolution
 */
export function getRecommendedSettings(resolution: string): {
  bitrate: number;
  codec: string;
  profile: string;
} {
  const settings: Record<string, { bitrate: number; codec: string; profile: string }> = {
    '720p': { bitrate: 5000000, codec: 'h264', profile: 'high' },
    '1080p': { bitrate: 8000000, codec: 'h264', profile: 'high' },
    '4K': { bitrate: 20000000, codec: 'h265', profile: 'main' },
  };

  return settings[resolution] || settings['1080p'];
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'];
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  if (!validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid video format. Supported: ${validExtensions.join(', ')}`,
    };
  }

  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5GB.',
    };
  }

  return { valid: true };
}

/**
 * Extract video info (simplified version)
 * In a real implementation, this would use FFprobe
 */
export async function extractVideoInfo(file: File): Promise<{
  duration: number;
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  codec: string;
}> {
  // This is a placeholder. In production, use FFprobe or similar
  return {
    duration: 60,
    width: 1920,
    height: 1080,
    fps: 30,
    bitrate: 8000000,
    codec: 'h264',
  };
}

/**
 * Generate thumbnail at specific timestamp
 * In a real implementation, this would use FFmpeg
 */
export async function generateThumbnail(
  file: File,
  timestamp: number = 0
): Promise<string> {
  // This is a placeholder. In production, use FFmpeg
  return '';
}

/**
 * Generate waveform for audio
 * In a real implementation, this would use audio processing
 */
export async function generateWaveform(file: File): Promise<number[]> {
  // This is a placeholder. In production, use Web Audio API or FFmpeg
  return [];
}
