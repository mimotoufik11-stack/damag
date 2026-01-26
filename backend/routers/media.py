"""Media API Router"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.media import MediaResponse
from services.media_service import MediaService

router = APIRouter()
media_service = MediaService()

@router.post("/upload", response_model=MediaResponse)
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload media file"""
    try:
        return await media_service.upload_file(file, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[MediaResponse])
async def get_media(
    skip: int = 0,
    limit: int = 20,
    media_type: str = None,
    search: str = None,
    db: Session = Depends(get_db),
):
    """Get all media files"""
    try:
        return await media_service.get_media(db, skip=skip, limit=limit, media_type=media_type, search=search)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{media_id}", response_model=MediaResponse)
async def get_media_file(media_id: str, db: Session = Depends(get_db)):
    """Get media file by ID"""
    media = await media_service.get_media_by_id(media_id, db)
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return media

@router.delete("/{media_id}")
async def delete_media(media_id: str, db: Session = Depends(get_db)):
    """Delete media file"""
    try:
        success = await media_service.delete_media(media_id, db)
        if not success:
            raise HTTPException(status_code=404, detail="Media not found")
        return {"message": "Media deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
