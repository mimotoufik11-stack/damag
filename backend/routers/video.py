from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks
from typing import Dict, Any
from pathlib import Path
import os
import uuid
import cv2
from moviepy.editor import VideoFileClip
import subprocess
import json

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)

def get_video_info_ffmpeg(video_path: str) -> Dict[str, Any]:
    """Extract video metadata using ffmpeg"""
    try:
        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            video_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        probe_data = json.loads(result.stdout)
        
        video_stream = next((stream for stream in probe_data["streams"] if stream["codec_type"] == "video"), None)
        format_data = probe_data.get("format", {})
        
        if not video_stream:
            raise HTTPException(status_code=400, detail="No video stream found")
        
        duration = float(video_stream.get("duration") or format_data.get("duration", 0))
        width = video_stream.get("width", 0)
        height = video_stream.get("height", 0)
        fps = eval(video_stream.get("r_frame_rate", "30/1"))  # Convert fraction to float
        codec = video_stream.get("codec_name", "unknown")
        size = int(format_data.get("size", 0))
        
        return {
            "duration": duration,
            "width": width,
            "height": height,
            "fps": fps,
            "codec": codec,
            "size": size,
            "bitrate": format_data.get("bit_rate", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze video: {str(e)}")

def generate_thumbnail(video_path: str, time: float = 1.0) -> str:
    """Generate video thumbnail at specified time"""
    try:
        video = cv2.VideoCapture(video_path)
        fps = video.get(cv2.CAP_PROP_FPS)
        frame_number = int(fps * time)
        
        video.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        success, frame = video.read()
        video.release()
        
        if not success:
            raise Exception("Failed to read frame")
        
        thumbnail_path = TEMP_DIR / f"thumb_{uuid.uuid4().hex}.jpg"
        cv2.imwrite(str(thumbnail_path), frame)
        
        return str(thumbnail_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate thumbnail: {str(e)}")

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload and process video file"""
    try:
        if not file.content_type or not file.content_type.startswith("video/"):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Check file size (max 2GB)
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > 2 * 1024 * 1024 * 1024:  # 2GB
            raise HTTPException(status_code=400, detail="File too large (max 2GB)")
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix or '.mp4'
        unique_filename = f"{uuid.uuid4().hex}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Get video metadata
        metadata = get_video_info_ffmpeg(str(file_path))
        
        # Generate thumbnail
        thumbnail_path = generate_thumbnail(str(file_path))
        
        return {
            "id": uuid.uuid4().hex,
            "name": file.filename,
            "path": str(file_path),
            "type": file.content_type,
            "metadata": metadata,
            "thumbnail": thumbnail_path,
            "size": file_size
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/info")
async def get_video_info(request: Dict[str, Any]):
    """Get video metadata"""
    try:
        video_path = request.get("filePath")
        if not video_path or not Path(video_path).exists():
            raise HTTPException(status_code=400, detail="Invalid video path")
        
        metadata = get_video_info_ffmpeg(video_path)
        return metadata
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get video info: {str(e)}")

@router.post("/extract-audio")
async def extract_audio(request: Dict[str, Any]):
    """Extract audio from video file"""
    try:
        video_path = request.get("videoPath")
        if not video_path or not Path(video_path).exists():
            raise HTTPException(status_code=400, detail="Invalid video path")
        
        audio_path = TEMP_DIR / f"audio_{uuid.uuid4().hex}.wav"
        
        # Use ffmpeg to extract audio
        cmd = [
            "ffmpeg",
            "-i", video_path,
            "-vn",  # No video
            "-acodec", "pcm_s16le",
            "-ar", "16000",  # 16kHz sample rate
            "-ac", "1",  # Mono
            "-y",  # Overwrite output
            str(audio_path)
        ]
        
        subprocess.run(cmd, check=True, capture_output=True)
        
        if not audio_path.exists():
            raise Exception("Audio extraction failed")
        
        return {"audioPath": str(audio_path), "format": "wav"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract audio: {str(e)}")

@router.post("/thumbnail")
async def generate_thumbnail_endpoint(request: Dict[str, Any]):
    """Generate video thumbnail"""
    try:
        video_path = request.get("videoPath")
        time = request.get("time", 1.0)
        
        if not video_path or not Path(video_path).exists():
            raise HTTPException(status_code=400, detail="Invalid video path")
        
        thumbnail_path = generate_thumbnail(video_path, float(time))
        return {"thumbnailPath": thumbnail_path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate thumbnail: {str(e)}")

@router.post("/resize")
async def resize_video(request: Dict[str, Any]):
    """Resize video to new resolution"""
    try:
        video_path = request.get("videoPath")
        width = request.get("width")
        height = request.get("height")
        quality = request.get("quality", "medium")
        
        if not video_path or not Path(video_path).exists():
            raise HTTPException(status_code=400, detail="Invalid video path")
        
        # Validate dimensions
        if not (isinstance(width, int) and isinstance(height, int)):
            raise HTTPException(status_code=400, detail="Width and height must be integers")
        
        if width < 1 or height < 1 or width > 8192 or height > 8192:
            raise HTTPException(status_code=400, detail="Invalid dimensions")
        
        # Generate output path
        output_path = OUTPUT_DIR / f"resized_{uuid.uuid4().hex}.mp4"
        
        # Set quality parameters
        quality_params = {
            "low": "1000k",
            "medium": "3000k",
            "high": "8000k",
            "ultra": "20000k"
        }
        bitrate = quality_params.get(quality, "3000k")
        
        # Use ffmpeg to resize
        cmd = [
            "ffmpeg",
            "-i", video_path,
            "-vf", f"scale={width}:{height}",
            "-c:v", "libx264",
            "-b:v", bitrate,
            "-c:a", "aac",
            "-b:a", "192k",
            "-y",
            str(output_path)
        ]
        
        subprocess.run(cmd, check=True, capture_output=True)
        
        if not output_path.exists():
            raise Exception("Video resize failed")
        
        return {"outputPath": str(output_path), "resolution": f"{width}x{height}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resize video: {str(e)}")

@router.get("/presets")
async def get_resolution_presets():
    """Get standard resolution presets"""
    return [
        {"name": "720p HD", "width": 1280, "height": 720, "aspectRatio": "16:9"},
        {"name": "1080p Full HD", "width": 1920, "height": 1080, "aspectRatio": "16:9"},
        {"name": "1440p QHD", "width": 2560, "height": 1440, "aspectRatio": "16:9"},
        {"name": "4K Ultra HD", "width": 3840, "height": 2160, "aspectRatio": "16:9"},
        {"name": "Instagram Square", "width": 1080, "height": 1080, "aspectRatio": "1:1"},
        {"name": "Instagram Story", "width": 1080, "height": 1920, "aspectRatio": "9:16"},
        {"name": "YouTube Shorts", "width": 1080, "height": 1920, "aspectRatio": "9:16"}
    ]