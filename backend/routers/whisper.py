from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pathlib import Path
import openai
import os
import tempfile
import json
import librosa
import numpy as np
import uuid

router = APIRouter()

# Mock Whisper implementation - in production use actual Whisper API
# For demo purposes, we'll use a simplified version
def mock_whisper_transcription(audio_path: str, language: str = "ar") -> Dict[str, Any]:
    """Mock transcription for demo purposes"""
    try:
        duration = librosa.get_duration(filename=audio_path)
        
        # Mock Arabic text samples (Quranic verses)
        arabic_samples = [
            {
                "text": "بسم الله الرحمن الرحيم",
                "translation": "In the name of Allah, the Most Gracious, the Most Merciful"
            },
            {
                "text": "الحمد لله رب العالمين",
                "translation": "All praise is due to Allah, Lord of the worlds"
            },
            {
                "text": "إياك نعبد وإياك نستعين",
                "translation": "You alone we worship and You alone we ask for help"
            },
            {
                "text": "الله لا إله إلا هو الحي القيوم",
                "translation": "Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining"
            },
            {
                "text": "قل هو الله أحد",
                "translation": "Say, He is Allah, [who is] One"
            }
        ]
        
        # Generate mock segments
        segments = []
        num_segments = max(3, int(duration / 3))  # One segment every 3 seconds
        segment_duration = duration / num_segments
        
        for i in range(num_segments):
            sample = arabic_samples[i % len(arabic_samples)]
            start_time = i * segment_duration
            end_time = (i + 1) * segment_duration
            
            # Generate word-level timestamps
            words = sample["text"].split()
            word_timestamps = []
            word_duration = segment_duration / len(words)
            
            for j, word in enumerate(words):
                word_start = start_time + (j * word_duration)
                word_end = word_start + word_duration
                
                word_timestamps.append({
                    "word": word,
                    "start": word_start,
                    "end": word_end,
                    "confidence": 0.85 + (np.random.random() * 0.15)  # 0.85-1.0
                })
            
            segments.append({
                "id": i,
                "start": start_time,
                "end": end_time,
                "text": sample["text"],
                "confidence": 0.8 + (np.random.random() * 0.2),  # 0.8-1.0
                "words": word_timestamps
            })
        
        return {
            "segments": segments,
            "language": language,
            "duration": duration,
            "segmentsCount": len(segments)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

def detect_audio_activity(audio_path: str, threshold: float = 0.1) -> List[Dict[str, float]]:
    """Detect active speech segments"""
    try:
        y, sr = librosa.load(audio_path, sr=None)
        
        # Split into segments
        hop_length = 512
        frame_length = 2048
        
        # Calculate energy
        energy = librosa.feature.rms(y=y, hop_length=hop_length)[0]
        
        # Find segments above threshold
        activity_segments = []
        is_active = False
        start_time = 0
        
        for i, e in enumerate(energy):
            time = i * hop_length / sr
            
            if e > threshold and not is_active:
                is_active = True
                start_time = time
            elif e <= threshold and is_active:
                is_active = False
                if time - start_time > 0.3:  # Minimum segment length
                    activity_segments.append({
                        "start": start_time,
                        "end": time,
                        "duration": time - start_time
                    })
        
        # Handle case where audio ends while active
        if is_active:
            duration = len(y) / sr
            activity_segments.append({
                "start": start_time,
                "end": duration,
                "duration": duration - start_time
            })
        
        return activity_segments
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to detect activity: {str(e)}")

@router.post("/transcribe")
async def transcribe_audio(request: Dict[str, Any]):
    """Transcribe audio using Whisper"""
    try:
        audio_path = request.get("audioPath")
        language = request.get("language", "ar")
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        return mock_whisper_transcription(audio_path, language)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@router.post("/transcribe-segments")
async def transcribe_with_segments(request: Dict[str, Any]):
    """Transcribe audio with detailed segment information"""
    try:
        audio_path = request.get("audioPath")
        language = request.get("language", "ar")
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        return mock_whisper_transcription(audio_path, language)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Segmented transcription failed: {str(e)}")

@router.post("/detect-speech")
async def detect_speech_segments(request: Dict[str, Any]):
    """Detect speech segments in audio"""
    try:
        audio_path = request.get("audioPath")
        threshold = request.get("threshold", 0.1)
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        segments = detect_audio_activity(audio_path, float(threshold))
        return {"segments": segments}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to detect speech: {str(e)}")

@router.post("/align")
async def align_text_to_audio(request: Dict[str, Any]):
    """Align text to audio with timestamps"""
    try:
        audio_path = request.get("audioPath")
        text = request.get("text", "")
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        if not text:
            # If no text provided, transcribe first
            transcription = mock_whisper_transcription(audio_path)
            text = transcription["segments"][0]["text"] if transcription["segments"] else ""
        
        # Mock alignment (in production would use proper forced alignment)
        duration = transcription["segments"][0]["end"] - transcription["segments"][0]["start"] if "segments" in locals() and transcription["segments"] else 10
        words = text.split()
        aligned_words = []
        
        word_duration = duration / len(words)
        for i, word in enumerate(words):
            aligned_words.append({
                "word": word,
                "start": i * word_duration,
                "end": (i + 1) * word_duration,
                "confidence": 0.9
            })
        
        return {
            "text": text,
            "duration": duration,
            "alignedWords": aligned_words
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to align text: {str(e)}")

@router.post("/diarize")
async def speaker_diarization(request: Dict[str, Any]):
    """Identify different speakers (mock implementation)"""
    try:
        audio_path = request.get("audioPath")
        num_speakers = request.get("numSpeakers", 1)
        
        if not audio_path or not Path(audio_path).exists():
            raise HTTPException(status_code=400, detail="Invalid audio path")
        
        duration = librosa.get_duration(filename=audio_path)
        
        # Generate mock speaker segments
        segments = []
        segment_duration = duration / max(3, num_speakers * 2)
        
        for i in range(max(3, num_speakers * 2)):
            start_time = i * segment_duration
            end_time = min((i + 1) * segment_duration, duration)
            
            segments.append({
                "start": start_time,
                "end": end_time,
                "speaker": f"Speaker {(i % num_speakers) + 1}",
                "confidence": 0.75
            })
        
        return {
            "speakers": list(set(seg["speaker"] for seg in segments)),
            "segments": segments
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diarization failed: {str(e)}")

@router.post("/batch-transcribe")
async def batch_transcribe(request: Dict[str, Any]):
    """Transcribe multiple files"""
    try:
        audio_paths = request.get("audioPaths", [])
        language = request.get("language", "ar")
        
        if not audio_paths:
            raise HTTPException(status_code=400, detail="No audio paths provided")
        
        results = []
        for path in audio_paths:
            if Path(path).exists():
                result = mock_whisper_transcription(path, language)
                result["file"] = path
                results.append(result)
        
        return {
            "results": results,
            "total": len(results),
            "successful": len(results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch transcription failed: {str(e)}")

@router.get("/models")
async def get_available_models():
    """Get available Whisper models"""
    return {
        "models": [
            {"name": "whisper-large-v3", "languages": ["ar", "en", "fr", "es", "de"], "accuracy": "high"},
            {"name": "whisper-medium", "languages": ["ar", "en", "fr", "es"], "accuracy": "medium"},
            {"name": "whisper-small", "languages": ["ar", "en"], "accuracy": "medium"},
            {"name": "whisper-base", "languages": ["ar", "en"], "accuracy": "low"},
            {"name": "whisper-tiny", "languages": ["ar", "en"], "accuracy": "low"}
        ]
    }