"""Audio API Router"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.audio import AudioMixResponse
from services.audio_service import AudioService

router = APIRouter()
audio_service = AudioService()

@router.post("/mix/{project_id}", response_model=AudioMixResponse)
async def mix_audio(project_id: str, data: dict, db: Session = Depends(get_db)):
    """Mix audio tracks"""
    try:
        return await audio_service.mix(project_id, data, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{audio_id}/effect")
async def apply_effect(audio_id: str, effect: dict, db: Session = Depends(get_db)):
    """Apply audio effect"""
    try:
        return await audio_service.apply_effect(audio_id, effect, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{audio_id}/convert")
async def convert_audio(audio_id: str, format: str, db: Session = Depends(get_db)):
    """Convert audio format"""
    try:
        return await audio_service.convert(audio_id, format, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{audio_id}/waveform")
async def get_waveform(audio_id: str, db: Session = Depends(get_db)):
    """Get audio waveform"""
    try:
        return await audio_service.get_waveform(audio_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{audio_id}/transcribe")
async def transcribe_audio(audio_id: str, options: dict, db: Session = Depends(get_db)):
    """Transcribe audio to text"""
    try:
        return await audio_service.transcribe(audio_id, options, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/tts")
async def text_to_speech(text: str, options: dict = {}):
    """Generate audio from text"""
    try:
        return await audio_service.text_to_speech(text, options)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/tts/voices")
async def get_voices(language: str = "ar"):
    """Get available TTS voices"""
    try:
        return await audio_service.get_voices(language)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
