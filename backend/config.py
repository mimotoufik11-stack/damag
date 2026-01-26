"""
Application configuration settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    # API settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Dammaj Al-Quran API"
    VERSION: str = "1.0.0"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./dammaj_quran.db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "dammaj_quran"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # File storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024 * 1024  # 5GB
    ALLOWED_VIDEO_EXTENSIONS: set = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
    ALLOWED_AUDIO_EXTENSIONS: set = {".mp3", ".wav", ".aac", ".m4a", ".ogg"}
    ALLOWED_IMAGE_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    
    # AI Services
    WHISPER_MODEL: str = "base"
    WHISPER_LANGUAGE: str = "ar"
    WHISPER_DEVICE: str = "cpu"  # or "cuda" for GPU support
    
    TTS_MODEL: str = "tts_models/ar/arabd/tacotron2"
    TTS_VOICE: str = "default"
    
    # FFmpeg settings
    FFMPEG_PATH: str = "ffmpeg"
    FFPROBE_PATH: str = "ffprobe"
    
    # Cache settings
    CACHE_DIR: str = "./cache"
    MAX_CACHE_SIZE: int = 1024 * 1024 * 1024  # 1GB
    
    # CORS settings
    CORS_ORIGINS: list = ["*"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
