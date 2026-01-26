"""Subtitles API Router"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.subtitle import SubtitleResponse
from services.subtitle_service import SubtitleService

router = APIRouter()
subtitle_service = SubtitleService()

@router.get("/{project_id}", response_model=list[SubtitleResponse])
async def get_subtitles(project_id: str, db: Session = Depends(get_db)):
    """Get all subtitles for a project"""
    try:
        return await subtitle_service.get_subtitles(project_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{project_id}/generate")
async def generate_subtitles(project_id: str, data: dict, db: Session = Depends(get_db)):
    """Generate subtitles using AI"""
    try:
        return await subtitle_service.generate_subtitles(project_id, data, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{project_id}/export/{format}")
async def export_subtitles(project_id: str, format: str, db: Session = Depends(get_db)):
    """Export subtitles in specified format"""
    try:
        return await subtitle_service.export_subtitles(project_id, format, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
