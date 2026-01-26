"""Fonts API Router"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.font import FontResponse
from services.font_service import FontService

router = APIRouter()
font_service = FontService()

@router.get("/", response_model=List[FontResponse])
async def get_fonts(
    skip: int = 0,
    limit: int = 20,
    search: str = None,
    db: Session = Depends(get_db),
):
    """Get all fonts"""
    try:
        return await font_service.get_fonts(db, skip=skip, limit=limit, search=search)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/upload", response_model=FontResponse)
async def upload_font(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload font file"""
    try:
        return await font_service.upload_font(file, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{font_id}", response_model=FontResponse)
async def get_font(font_id: str, db: Session = Depends(get_db)):
    """Get font by ID"""
    font = await font_service.get_font_by_id(font_id, db)
    if not font:
        raise HTTPException(status_code=404, detail="Font not found")
    return font

@router.delete("/{font_id}")
async def delete_font(font_id: str, db: Session = Depends(get_db)):
    """Delete font"""
    try:
        success = await font_service.delete_font(font_id, db)
        if not success:
            raise HTTPException(status_code=404, detail="Font not found")
        return {"message": "Font deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
