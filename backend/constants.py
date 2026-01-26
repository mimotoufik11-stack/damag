"""
Application constants
"""

# Quran constants
SURAH_COUNT = 114
AYAH_COUNT = 6236
JUZ_COUNT = 30

# Video settings
VIDEO_RESOLUTIONS = {
    "720p": {"width": 1280, "height": 720},
    "1080p": {"width": 1920, "height": 1080},
    "4K": {"width": 3840, "height": 2160},
}

VIDEO_FORMATS = ["mp4", "webm", "mov", "avi"]
VIDEO_QUALITIES = ["low", "medium", "high"]
FRAME_RATES = [24, 25, 30, 50, 60]

# Audio settings
AUDIO_FORMATS = ["mp3", "wav", "aac", "m4a", "ogg"]
AUDIO_BITRATES = ["128k", "192k", "256k", "320k"]
AUDIO_SAMPLE_RATES = [22050, 44100, 48000, 96000]

# Subtitle formats
SUBTITLE_FORMATS = ["srt", "vtt", "ass"]

# Export settings
EXPORT_FORMATS = ["mp4", "webm"]
EXPORT_QUALITIES = {
    "low": {"video_bitrate": "2000k", "audio_bitrate": "128k"},
    "medium": {"video_bitrate": "5000k", "audio_bitrate": "192k"},
    "high": {"video_bitrate": "8000k", "audio_bitrate": "256k"},
}

# AI Models
WHISPER_MODELS = ["tiny", "base", "small", "medium", "large", "large-v1", "large-v2", "large-v3"]
WHISPER_LANGUAGES = ["ar", "en", "fr", "es", "de", "tr", "ur", "fa", "id"]

# Storage limits
MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024  # 5GB
MAX_PROJECT_SIZE = 10 * 1024 * 1024 * 1024  # 10GB
CACHE_SIZE_LIMIT = 1024 * 1024 * 1024  # 1GB

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# History limits
MAX_HISTORY = 100
MAX_CLIPBOARD = 50

# Supported MIME types
VIDEO_MIME_TYPES = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
]

AUDIO_MIME_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "audio/aac",
    "audio/mp4",
    "audio/ogg",
]

IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
]

# Error messages
ERROR_MESSAGES = {
    "file_too_large": "File size exceeds maximum limit",
    "invalid_format": "Invalid file format",
    "project_not_found": "Project not found",
    "media_not_found": "Media file not found",
    "export_failed": "Export failed",
    "transcription_failed": "Transcription failed",
    "tts_failed": "Text-to-speech generation failed",
}

# Success messages
SUCCESS_MESSAGES = {
    "project_created": "Project created successfully",
    "project_updated": "Project updated successfully",
    "project_deleted": "Project deleted successfully",
    "media_uploaded": "Media uploaded successfully",
    "export_started": "Export started successfully",
    "export_completed": "Export completed successfully",
}

# Job statuses
JOB_STATUS = {
    "PENDING": "pending",
    "PROCESSING": "processing",
    "COMPLETED": "completed",
    "FAILED": "failed",
}

# Job types
JOB_TYPES = {
    "EXPORT": "export",
    "TRANSCRIBE": "transcribe",
    "TTS": "tts",
    "DENOISE": "denoise",
}
