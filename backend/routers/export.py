from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import Dict, Any, List, Optional
from pathlib import Path
import subprocess
import tempfile
import json
import asyncio
import time
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip
from moviepy.video.fx.all import resize, crop
import numpy as np
from pydub import AudioSegment
import os

router = APIRouter()

class VideoRenderer:
    def __init__(self):
        self.active_renders = {}
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)
    
    def create_subtitle_clip(self, text: str, start: float, duration: float, 
                            style: Dict[str, Any]) -> TextClip:
        """Create a styled subtitle clip"""
        try:
            font = style.get("font", "Arial")
            font_size = style.get("fontSize", 60)
            color = style.get("color", "white")
            bg_color = style.get("backgroundColor", "transparent")
            stroke_color = style.get("strokeColor", "black")
            stroke_width = style.get("strokeWidth", 2)
            position = style.get("position", "bottom")
            
            # Create text clip
            txt_clip = TextClip(
                txt=text,
                fontsize=font_size,
                color=color,
                font=font,
                stroke_color=stroke_color,
                stroke_width=stroke_width,
                bg_color=bg_color,
                align="center"
            )
            
            # Set position based on alignment
            if position == "top":
                txt_clip = txt_clip.set_position(('center', 0.1))
            elif position == "center":
                txt_clip = txt_clip.set_position(('center', 'center'))
            else:  # bottom
                txt_clip = txt_clip.set_position(('center', 0.9), relative=True)
            
            # Set timing
            txt_clip = txt_clip.set_start(start).set_duration(duration)
            
            # Apply opacity
            opacity = style.get("opacity", 1.0)
            if opacity < 1.0:
                txt_clip = txt_clip.set_opacity(opacity)
            
            return txt_clip
            
        except Exception as e:
            # Fallback to simpler text clip if styling fails
            txt_clip = TextClip(
                txt=text,
                fontsize=50,
                color="white",
                bg_color="black"
            )
            return txt_clip.set_start(start).set_duration(duration).set_position(('center', 'center'))
    
    def apply_video_effects(self, clip, effects: List[Dict[str, Any]]):
        """Apply video effects to clip"""
        for effect in effects:
            effect_type = effect.get("type")
            value = effect.get("value", 0)
            
            try:
                if effect_type == "brightness":
                    clip = clip.fx(lambda c: c.fl_image(lambda frame: np.clip(frame * (1 + value/100), 0, 255).astype(np.uint8)))
                elif effect_type == "contrast":
                    clip = clip.fx(lambda c: c.fl_image(lambda frame: np.clip(((frame - 128) * (value/100)) + 128, 0, 255).astype(np.uint8)))
                elif effect_type == "saturation":
                    # Implemented as simple color enhancement
                    factor = value / 100
                    clip = clip.fx(lambda c: c.fl_image(lambda frame: np.clip(frame * factor, 0, 255).astype(np.uint8)))
                elif effect_type == "blur":
                    from moviepy.video.filters.blur import blur
                    clip = clip.fx(blur, radius=value)
            except Exception:
                # Continue if effect fails
                pass
        
        return clip
    
    async def render_video(self, render_settings: Dict[str, Any], 
                         progress_callback=None) -> str:
        """Render video with overlays and effects"""
        try:
            video_path = render_settings.get("videoPath")
            subtitles = render_settings.get("subtitles", [])]
            audio_tracks = render_settings.get("audioTracks", [])
            effects = render_settings.get("effects", []})
            output_path = render_settings.get("outputPath")
            export_settings = render_settings.get("exportSettings", {})
            
            if not video_path or not Path(video_path).exists():
                raise HTTPException(status_code=400, detail="Invalid video path")
            
            # Create output filename if not provided
            if not output_path:
                suffix = Path(video_path).suffix or '.mp4'
                output_filename = f"exported_{uuid.uuid4().hex}{suffix}"
                output_path = str(self.output_dir / output_filename)
            
            if progress_callback:
                progress_callback({
                    "progress": 5,
                    "stage": "Loading video",
                    "timeElapsed": 1,
                    "timeRemaining": 60
                })
            
            # Load video
            video_clip = VideoFileClip(video_path)
            
            if progress_callback:
                progress_callback({
                    "progress": 15,
                    "stage": "Applying effects",
                    "timeElapsed": 3,
                    "timeRemaining": 50
                })
            
            # Apply video effects
            video_clip = self.apply_video_effects(video_clip, effects.get("video", []))
            
            # Create subtitle clips
            subtitle_clips = []
            for subtitle in subtitles:
                try:
                    text = subtitle.get("text", "")
                    start = subtitle.get("start", 0)
                    end = subtitle.get("end", start + 3)
                    style = subtitle.get("style", {})
                    
                    duration = end - start
                    if duration > 0 and text:
                        subtitle_clip = self.create_subtitle_clip(text, start, duration, style)
                        subtitle_clips.append(subtitle_clip)
                except Exception:
                    # Skip problematic subtitles
                    continue
            
            if progress_callback:
                progress_callback({
                    "progress": 30,
                    "stage": "Processing subtitles",
                    "timeElapsed": 6,
                    "timeRemaining": 45
                })
            
            # Combine video with subtitles
            if subtitle_clips:
                final_clip = CompositeVideoClip([video_clip] + subtitle_clips)
            else:
                final_clip = video_clip
            
            if progress_callback:
                progress_callback({
                    "progress": 50,
                    "stage": "Processing audio",
                    "timeElapsed": 10,
                    "timeRemaining": 35
                })
            
            # Add audio tracks
            if audio_tracks:
                try:
                    # For simplicity, use the first audio track
                    audio_path = audio_tracks[0].get("path")
                    if audio_path and Path(audio_path).exists():
                        audio_clip = AudioFileClip(audio_path)
                        final_clip = final_clip.set_audio(audio_clip)
                except Exception:
                    # Use original audio if track fails
                    pass
            
            if progress_callback:
                progress_callback({
                    "progress": 70,
                    "stage": "Rendering video",
                    "timeElapsed": 15,
                    "timeRemaining": 20
                })
            
            # Apply export settings
            fps = export_settings.get("fps", video_clip.fps or 30)
            codec = export_settings.get("videoCodec", "libx264")
            bitrate = export_settings.get("videoBitrate", "5000k")
            audio_codec = export_settings.get("audioCodec", "aac")
            audio_bitrate = export_settings.get("audioBitrate", "192k")
            
            # Write final video
            final_clip.write_videofile(
                output_path,
                fps=fps,
                codec=codec,
                bitrate=bitrate,
                audio_codec=audio_codec,
                audio_bitrate=audio_bitrate,
                preset="medium",
                threads=4,
                write_logfile=False
            )
            
            # Clean up
            final_clip.close()
            video_clip.close()
            
            if progress_callback:
                progress_callback({
                    "progress": 100,
                    "stage": "Complete",
                    "timeElapsed": 30,
                    "timeRemaining": 0
                })
            
            return output_path
            
        except Exception as e:
            # Clean up on error
            if 'final_clip' in locals():
                final_clip.close()
            if 'video_clip' in locals():
                video_clip.close()
            
            raise HTTPException(status_code=500, detail=f"Render failed: {str(e)}")
    
    def get_export_presets(self) -> List[Dict[str, Any]]:
        """Get export quality presets"""
        return [
            {
                "name": "Low Quality (480p)",
                "resolution": {"width": 854, "height": 480},
                "fps": 24,
                "videoBitrate": "2M",
                "audioBitrate": "128k",
                "format": "mp4"
            },
            {
                "name": "Medium Quality (720p)",
                "resolution": {"width": 1280, "height": 720},
                "fps": 30,
                "videoBitrate": "5M",
                "audioBitrate": "128k",
                "format": "mp4"
            },
            {
                "name": "High Quality (1080p)",
                "resolution": {"width": 1920, "height": 1080},
                "fps": 30,
                "videoBitrate": "15M",
                "audioBitrate": "192k",
                "format": "mp4"
            },
            {
                "name": "Ultra Quality (4K)",
                "resolution": {"width": 3840, "height": 2160},
                "fps": 60,
                "videoBitrate": "50M",
                "audioBitrate": "320k",
                "format": "mp4"
            },
            {
                "name": "Web Optimized",
                "resolution": {"width": 1920, "height": 1080},
                "fps": 30,
                "videoBitrate": "8M",
                "audioBitrate": "160k",
                "format": "webm"
            }
        ]

renderer = VideoRenderer()

@router.post("/start")
async def start_export(request: Dict[str, Any]):
    """Start video export job"""
    try:
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Queue render job
        renderer.active_renders[job_id] = {
            "status": "queued",
            "progress": 0,
            "settings": request,
            "startTime": time.time(),
            "output": ""
        }
        
        return {"jobId": job_id, "status": "queued"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start export: {str(e)}")

@router.get("/presets")
async def get_presets():
    """Get export presets"""
    try:
        return renderer.get_export_presets()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get presets: {str(e)}")

@router.post("/progress/{job_id}")
async def get_progress(job_id: str):
    """Get export progress"""
    try:
        if job_id not in renderer.active_renders:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job = renderer.active_renders[job_id]
        
        return {
            "jobId": job_id,
            "status": job["status"],
            "progress": job["progress"],
            "output": job["output"],
            "elapsedTime": int(time.time() - job["startTime"])
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get progress: {str(e)}")

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket for real-time export updates"""
    await websocket.accept()
    job_id = None
    
    try:
        # Receive render settings
        data = await websocket.receive_text()
        render_settings = json.loads(data)
        
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Initialize progress
        renderer.active_renders[job_id] = {
            "status": "rendering",
            "progress": 0,
            "settings": render_settings,
            "startTime": time.time(),
            "output": ""
        }
        
        # Send initial status
        await websocket.send_json({
            "type": "progress",
            "progress": {"progress": 0, "stage": "Starting", "timeElapsed": 0, "timeRemaining": 60}
        })
        
        # Progress callback
        async def progress_callback(progress_data):
            try:
                renderer.active_renders[job_id]["progress"] = progress_data["progress"]
                
                await websocket.send_json({
                    "type": "progress",
                    "progress": progress_data
                })
            except Exception:
                pass
        
        # Convert callback for sync function
        def sync_progress_callback(progress_data):
            asyncio.create_task(progress_callback(progress_data))
        
        # Render video
        output_path = await renderer.render_video(render_settings, sync_progress_callback)
        
        # Update job completion
        renderer.active_renders[job_id] = {
            "status": "completed",
            "progress": 100,
            "settings": render_settings,
            "startTime": renderer.active_renders[job_id]["startTime"],
            "output": output_path
        }
        
        # Send completion
        await websocket.send_json({
            "type": "complete",
            "outputPath": output_path
        })
        
    except WebSocketDisconnect:
        if job_id and job_id in renderer.active_renders:
            renderer.active_renders[job_id]["status"] = "cancelled"
    except Exception as e:
        if job_id and job_id in renderer.active_renders:
            renderer.active_renders[job_id]["status"] = "failed"
        
        await websocket.send_json({
            "type": "error",
            "error": str(e)
        })
    finally:
        await websocket.close()

@router.post("/cancel/{job_id}")
async def cancel_export(job_id: str):
    """Cancel export job"""
    try:
        if job_id in renderer.active_renders:
            renderer.active_renders[job_id]["status"] = "cancelled"
            return {"success": True, "message": "Export cancelled"}
        
        raise HTTPException(status_code=404, detail="Job not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cancel export: {str(e)}")