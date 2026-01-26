"""AI Services API Router"""
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.ai import TranscribeRequest, TTSRequest, AIJobResponse
from services.whisper_service import WhisperService
from services.tts_service import TTSService

router = APIRouter()
whisper_service = WhisperService()
tts_service = TTSService()

@router.post("/transcribe", response_model=AIJobResponse)
async def transcribe_audio(
    request: TranscribeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Transcribe audio using Whisper"""
    try:
        job_id = await whisper_service.transcribe(request, db)
        return {"id": job_id, "status": "processing", "progress": 0}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/transcribe/{job_id}", response_model=AIJobResponse)
async def get_transcription_status(job_id: str, db: Session = Depends(get_db)):
    """Get transcription job status"""
    try:
        return await whisper_service.get_job_status(job_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/tts", response_model=AIJobResponse)
async def text_to_speech(
    request: TTSRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Generate audio from text using TTS"""
    try:
        job_id = await tts_service.generate(request, db)
        return {"id": job_id, "status": "processing", "progress": 0}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/tts/{job_id}", response_model=AIJobResponse)
async def get_tts_status(job_id: str, db: Session = Depends(get_db)):
    """Get TTS job status"""
    try:
        return await tts_service.get_job_status(job_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/tts/voices")
async def get_tts_voices(language: str = "ar"):
    """Get available TTS voices"""
    try:
        return await tts_service.get_voices(language)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
