"""Export API Router"""
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.export import ExportConfig, ExportJobResponse
from services.export_service import ExportService

router = APIRouter()
export_service = ExportService()

@router.post("/", response_model=ExportJobResponse)
async def start_export(
    project_id: str,
    config: ExportConfig,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Start export job"""
    try:
        job_id = await export_service.start_export(project_id, config, db)
        return {"id": job_id, "status": "processing", "progress": 0}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{job_id}", response_model=ExportJobResponse)
async def get_export_status(job_id: str, db: Session = Depends(get_db)):
    """Get export job status"""
    try:
        return await export_service.get_job_status(job_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{job_id}")
async def cancel_export(job_id: str, db: Session = Depends(get_db)):
    """Cancel export job"""
    try:
        success = await export_service.cancel_job(job_id, db)
        if not success:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Export cancelled successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history/{project_id}")
async def get_export_history(project_id: str, db: Session = Depends(get_db)):
    """Get export history for project"""
    try:
        return await export_service.get_history(project_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
