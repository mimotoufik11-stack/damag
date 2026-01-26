/**
 * Format duration in seconds to a readable time string
 */
export function formatTime(seconds: number, format: 'mm:ss' | 'hh:mm:ss' | 'hh:mm:ss:ff' = 'mm:ss'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30); // Assuming 30 fps

  const mm = minutes.toString().padStart(2, '0');
  const ss = secs.toString().padStart(2, '0');
  const hh = hours.toString().padStart(2, '0');
  const ff = frames.toString().padStart(2, '0');

  switch (format) {
    case 'mm:ss':
      return `${mm}:${ss}`;
    case 'hh:mm:ss':
      return `${hh}:${mm}:${ss}`;
    case 'hh:mm:ss:ff':
      return `${hh}:${mm}:${ss}:${ff}`;
    default:
      return `${mm}:${ss}`;
  }
}

/**
 * Parse time string to seconds
 */
export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  
  if (parts.length === 2) {
    const [mm, ss] = parts;
    return mm * 60 + (ss || 0);
  } else if (parts.length === 3) {
    const [hh, mm, rest] = parts;
    const ssAndFrames = rest.toString().split('.');
    const ss = parseInt(ssAndFrames[0]);
    const frames = parseInt(ssAndFrames[1] || '0');
    return hh * 3600 + mm * 60 + ss + frames / 30;
  } else if (parts.length === 4) {
    const [hh, mm, ss, ff] = parts;
    return hh * 3600 + mm * 60 + ss + ff / 30;
  }

  return 0;
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Format date to localized string
 */
export function formatDate(date: string | Date, locale: string = 'ar-EG'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date time to localized string
 */
export function formatDateTime(date: string | Date, locale: string = 'ar-EG'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, locale: string = 'ar-EG'): string {
  return num.toLocaleString(locale);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format frame rate
 */
export function formatFrameRate(fps: number): string {
  return `${fps} fps`;
}

/**
 * Format resolution
 */
export function formatResolution(width: number, height: number): string {
  if (width === 1920 && height === 1080) return '1080p';
  if (width === 1280 && height === 720) return '720p';
  if (width === 3840 && height === 2160) return '4K';
  return `${width}x${height}`;
}

/**
 * Format bitrate
 */
export function formatBitrate(bitrate: number): string {
  if (bitrate >= 1000000) return `${(bitrate / 1000000).toFixed(1)} Mbps`;
  if (bitrate >= 1000) return `${(bitrate / 1000).toFixed(1)} kbps`;
  return `${bitrate} bps`;
}
