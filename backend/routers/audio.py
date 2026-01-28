from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pathlib import Path
import librosa
import numpy as np
from pydub import AudioSegment
from pydub.effects import normalize
import subprocess
import json

router = APIRouter()

def get_audio_info(audio_path: str) -> Dict[str, Any]:
    """Extract audio metadata"""
    try:
        y, sr = librosa.load(audio_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)
        
        # Get additional info with ffprobe
        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            audio_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        probe_data = json.loads(result.stdout)
        
        audio_stream = next((stream for stream in probe_data["streams"] if stream["codec_type"] == "audio"), None)
        format_data = probe_data.get("format", {})
        
        return {
            "duration": duration,
            "sampleRate": sr,
            "channels": len(y.shape) if y.ndim > 1 else 1,
            "codec": audio_stream.get("codec_name", "unknown") if audio_stream else "unknown",
            "size": int(format_data.get("size", 0)),
            "bitrate": format_data.get("bit_rate", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze audio: {str(e)}")

def detect_silence(audio_path: str, threshold_db: float = -40.0, min_silence_len: float = 0.5) -> List[Dict[str, float]]:
    """Detect silence/pauses in audio"""
    try:
        audio = AudioSegment.from_file(audio_path)
        silence_ranges = []
        
        # Convert to dB
        dBFS = audio.dBFS
        
        # Find silence
        silence_threshold = dBFS + threshold_db if dBFS != float('-inf') else threshold_db
        
        min_silence_ms = int(min_silence_len * 1000)
        
        chunks = []
        current_pos = 0
        
        for chunk in audio:
            if chunk.dBFS < silence_threshold:
                if not chunks or current_pos - chunks[-1][1] > min_silence_ms:
                    chunks.append([current_pos, current_pos + len(chunk)])
                else:
                    chunks[-1][1] = current_pos + len(chunk)
            current_pos += len(chunk)
        
        # Convert to seconds
        for chunk in chunks:
            silence_ranges.append({
                "start": chunk[0] / 1000.0,
                "end": chunk[1] / 1000.0,
                "duration": (chunk[1] - chunk[0]) / 1000.0
            })
        
        return silence_ranges
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to detect silence: {str(e)}")

def apply_audio_effects(audio_path: str, effects: Dict[str, Any]) -> str:
    """Apply audio effects"""
    try:
        audio = AudioSegment.from_file(audio_path)
        
        # Volume
        if "volume" in effects:
            volume_db = 20 * np.log10(effects["volume"])
            audio = audio + volume_db
        
        # Normalize
        if effects.get("normalize", False):
            audio = normalize(audio)
        
        # Fade in/out
        if "fadeIn" in effects:
            fade_in_ms = int(effects["fadeIn"] * 1000)
            audio = audio.fade_in(fade_in_ms)
        
        if "fadeOut" in effects:
            fade_out_ms = int(effects["fadeOut"] * 1000)
            audio = audio.fade_out(fade_out_ms)
        
        # Export
        output_path = audio_path.replace(".", "_processed.")
        audio.export(output_path, format="wav")
        
        return output_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply effects: {str(e)}")

@router.post("/duration")
async def get_duration(request: Dict[str, Any]):
    """Get audio duration"""
    try:
        audio_path = request.get("audioPath")
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        info = get_audio_info(audio_path)
        return {"duration": info["duration"]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get duration: {str(e)}")

@router.post("/info")
async def get_audio_info_endpoint(request: Dict[str, Any]):
    """Get full audio information"""
    try:
        audio_path = request.get("audioPath")
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        info = get_audio_info(audio_path)
        return info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get audio info: {str(e)}")

@router.post("/detect-pauses")
async def detect_pauses(request: Dict[str, Any]):
    """Detect pauses/silence in audio"""
    try:
        audio_path = request.get("audioPath")
        threshold = request.get("threshold", 0.5)
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        silence_ranges = detect_silence(audio_path, threshold_db=-40.0, min_silence_len=float(threshold))
        return {"pauses": silence_ranges}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to detect pauses: {str(e)}")

@router.post("/normalize")
async def normalize_audio(request: Dict[str, Any]):
    """Normalize audio volume"""
    try:
        audio_path = request.get("audioPath")
        target_dBFS = request.get("target", -20.0)
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        audio = AudioSegment.from_file(audio_path)
        normalized = normalize(audio)
        
        output_path = str(Path(audio_path).parent / f"normalized_{Path(audio_path).name}")
        normalized.export(output_path, format="wav")
        
        return {"outputPath": output_path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to normalize audio: {str(e)}")

@router.post("/apply-effects")
async def apply_effects(request: Dict[str, Any]):
    """Apply audio effects"""
    try:
        audio_path = request.get("audioPath")
        effects = request.get("effects", {})
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        output_path = apply_audio_effects(audio_path, effects)
        return {"outputPath": output_path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply effects: {str(e)}")

@router.post("/fade")
async def add_fade(request: Dict[str, Any]):
    """Add fade in/out"""
    try:
        audio_path = request.get("audioPath")
        fade_in = request.get("fadeIn", 0)
        fade_out = request.get("fadeOut", 0)
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        audio = AudioSegment.from_file(audio_path)
        
        if fade_in > 0:
            audio = audio.fade_in(int(fade_in * 1000))
        
        if fade_out > 0:
            audio = audio.fade_out(int(fade_out * 1000))
        
        output_path = str(Path(audio_path).parent / f"faded_{Path(audio_path).name}")
        audio.export(output_path, format="wav")
        
        return {"outputPath": output_path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add fade: {str(e)}")

@router.post("/waveform")
async def generate_waveform(request: Dict[str, Any]):
    """Generate audio waveform data"""
    try:
        audio_path = request.get("audioPath")
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        y, sr = librosa.load(audio_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)
        
        # Generate waveform samples (100 samples per second)
        num_samples = int(duration * 100)
        samples = []
        
        for i in range(num_samples):
            start_idx = int(i * len(y) / num_samples)
            end_idx = int((i + 1) * len(y) / num_samples)
            chunk = y[start_idx:end_idx]
            samples.append({
                "samples": chunk.tolist()[:100],  # Limit samples for JSON
                "max": float(np.max(np.abs(chunk))),
                "rms": float(np.sqrt(np.mean(chunk**2)))
            })
        
        return {
            "duration": duration,
            "sampleRate": sr,
            "waveformData": samples
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate waveform: {str(e)}")

@router.get("/effects/presets")
async def get_audio_presets():
    """Get audio effect presets"""
    return [
        {"name": "Voice Enhancement", "volume": 1.2, "normalize": True, "fadeIn": 0.1, "fadeOut": 0.1},
        {"name": "Background Music", "volume": 0.6, "fadeIn": 2.0, "fadeOut": 2.0},
        {"name": "Podcast", "volume": 1.0, "normalize": True, "fadeIn": 0.5, "fadeOut": 0.5},
        {"name": "Loudness Boost", "volume": 1.5, "normalize": True},
    ]