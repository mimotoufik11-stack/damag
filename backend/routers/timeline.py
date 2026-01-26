"""Timeline API Router"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.timeline import TimelineResponse, ClipCreate
from services.timeline_service import TimelineService

router = APIRouter()
timeline_service = TimelineService()

@router.post("/save")
async def save_timeline(
    project_id: str,
    data: dict,
    db: Session = Depends(get_db)
):
    """Save timeline state"""
    try:
        return await timeline_service.save_timeline(project_id, data, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}", response_model=TimelineResponse)
async def get_timeline(project_id: str, db: Session = Depends(get_db)):
    """Get timeline by project ID"""
    timeline = await timeline_service.get_timeline(project_id, db)
    if not timeline:
        raise HTTPException(status_code=404, detail="Timeline not found")
    return timeline

@router.post("/{project_id}/clips")
async def add_clip(
    project_id: str,
    clip: ClipCreate,
    db: Session = Depends(get_db)
):
    """Add clip to timeline"""
    try:
        return await timeline_service.add_clip(project_id, clip, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{project_id}/clips/{clip_id}")
async def update_clip(
    project_id: str,
    clip_id: str,
    clip_update: dict,
    db: Session = Depends(get_db)
):
    """Update clip"""
    try:
        return await timeline_service.update_clip(project_id, clip_id, clip_update, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}/clips/{clip_id}")
async def delete_clip(project_id: str, clip_id: str, db: Session = Depends(get_db)):
    """Delete clip"""
    try:
        success = await timeline_service.delete_clip(project_id, clip_id, db)
        if not success:
            raise HTTPException(status_code=404, detail="Clip not found")
        return {"message": "Clip deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
