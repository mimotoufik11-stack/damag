"""
Projects API Router
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from datetime import datetime

from database.db import get_db
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from services.project_service import ProjectService

router = APIRouter()
project_service = ProjectService()


@router.post("/", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project"""
    try:
        return await project_service.create_project(project, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = 0,
    limit: int = 20,
    search: str = None,
    recent: bool = False,
    db: Session = Depends(get_db),
):
    """Get all projects"""
    try:
        return await project_service.get_projects(db, skip=skip, limit=limit, search=search, recent=recent)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get project by ID"""
    project = await project_service.get_project(project_id, db)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
):
    """Update project"""
    try:
        project = await project_service.update_project(project_id, project_update, db)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{project_id}")
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete project"""
    try:
        success = await project_service.delete_project(project_id, db)
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{project_id}/duplicate", response_model=ProjectResponse)
async def duplicate_project(
    project_id: str,
    new_name: str = None,
    db: Session = Depends(get_db),
):
    """Duplicate project"""
    try:
        project = await project_service.duplicate_project(project_id, new_name, db)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{project_id}/autosave", response_model=ProjectResponse)
async def autosave_project(
    project_id: str,
    data: dict,
    db: Session = Depends(get_db),
):
    """Auto-save project"""
    try:
        project = await project_service.autosave_project(project_id, data, db)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}/stats")
async def get_project_stats(project_id: str, db: Session = Depends(get_db)):
    """Get project statistics"""
    try:
        stats = await project_service.get_project_stats(project_id, db)
        if not stats:
            raise HTTPException(status_code=404, detail="Project not found")
        return stats
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
