from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pathlib import Path
import json
import uuid
from datetime import datetime
import sqlite3
import os

router = APIRouter()

PROJECTS_DB = Path("projects.db")
PROJECTS_DIR = Path("projects_data")
PROJECTS_DIR.mkdir(exist_ok=True)

def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect(PROJECTS_DB)
    cursor = conn.cursor()
    
    # Create projects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            thumbnail TEXT,
            video_path TEXT,
            audio_path TEXT,
            resolution TEXT,
            duration REAL,
            fps REAL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            file_size INTEGER DEFAULT 0,
            metadata TEXT DEFAULT '{}'
        )
    ''')
    
    # Create project data table (timelines, clips, etc)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_data (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            data_type TEXT,
            data TEXT,
            created_at TEXT,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

class ProjectManager:
    def __init__(self):
        self.db_path = PROJECTS_DB
    
    def create_project(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new project"""
        project_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        project = {
            "id": project_id,
            "name": data.get("name", "Untitled Project"),
            "description": data.get("description", ""),
            "thumbnail": data.get("thumbnail", ""),
            "video_path": data.get("videoPath", ""),
            "audio_path": data.get("audioPath", ""),
            "resolution": data.get("resolution", "1920x1080"),
            "duration": data.get("duration", 0),
            "fps": data.get("fps", 30),
            "created_at": now,
            "updated_at": now,
            "file_size": data.get("fileSize", 0),
            "metadata": json.dumps(data.get("metadata", {}))
        }
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO projects 
            (id, name, description, thumbnail, video_path, audio_path, 
             resolution, duration, fps, created_at, updated_at, file_size, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            project["id"], project["name"], project["description"], 
            project["thumbnail"], project["video_path"], project["audio_path"],
            project["resolution"], project["duration"], project["fps"],
            project["created_at"], project["updated_at"], 
            project["file_size"], project["metadata"]
        ))
        conn.commit()
        conn.close()
        
        return project
    
    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        """Get project by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return self._row_to_dict(row)
        return None
    
    def get_all_projects(self) -> List[Dict[str, Any]]:
        """Get all projects"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects ORDER BY updated_at DESC")
        rows = cursor.fetchall()
        conn.close()
        
        return [self._row_to_dict(row) for row in rows]
    
    def update_project(self, project_id: str, updates: Dict[str, Any]) -> bool:
        """Update project"""
        now = datetime.now().isoformat()
        updates["updated_at"] = now
        
        # Handle metadata specially
        if "metadata" in updates and isinstance(updates["metadata"], dict):
            updates["metadata"] = json.dumps(updates["metadata"])
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Build update query
        set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
        values = list(updates.values()) + [project_id]
        
        cursor.execute(f"UPDATE projects SET {set_clause} WHERE id = ?", values)
        rows_affected = cursor.rowcount
        conn.commit()
        conn.close()
        
        return rows_affected > 0
    
    def delete_project(self, project_id: str) -> bool:
        """Delete project"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM project_data WHERE project_id = ?", (project_id,))
        cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        rows_affected = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        return rows_affected > 0
    
    def save_project_data(self, project_id: str, data_type: str, data: Dict[str, Any]) -> str:
        """Save project-specific data (timeline, settings, etc)"""
        data_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO project_data (id, project_id, data_type, data, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (data_id, project_id, data_type, json.dumps(data), now))
        
        conn.commit()
        conn.close()
        
        return data_id
    
    def get_project_data(self, project_id: str, data_type: str) -> Optional[Dict[str, Any]]:
        """Get project-specific data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, data, created_at FROM project_data 
            WHERE project_id = ? AND data_type = ? 
            ORDER BY created_at DESC LIMIT 1
        ''', (project_id, data_type))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                "id": row[0],
                "data": json.loads(row[1]) if row[1] else {},
                "created_at": row[2]
            }
        return None
    
    def _row_to_dict(self, row) -> Dict[str, Any]:
        """Convert SQLite row to dictionary"""
        columns = ["id", "name", "description", "thumbnail", "video_path", 
                  "audio_path", "resolution", "duration", "fps", "created_at", 
                  "updated_at", "file_size", "metadata"]
        
        project = dict(zip(columns, row))
        project["metadata"] = json.loads(project["metadata"]) if project["metadata"] else {}
        return project

project_manager = ProjectManager()

@router.post("/create")
async def create_project(request: Dict[str, Any]):
    """Create new project"""
    try:
        project = project_manager.create_project(request)
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.get("/{project_id}")
async def get_project(project_id: str):
    """Get project by ID"""
    try:
        project = project_manager.get_project(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Add timeline data if available
        timeline_data = project_manager.get_project_data(project_id, "timeline")
        
        return {
            **project,
            "timeline": timeline_data["data"] if timeline_data else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get project: {str(e)}")

@router.get("/")
async def list_projects():
    """List all projects"""
    try:
        projects = project_manager.get_all_projects()
        
        # Add minimal data
        for project in projects:
            project["metadata"] = project.get("metadata", {})
        
        return {"projects": projects, "count": len(projects)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list projects: {str(e)}")

@router.post("/{project_id}/update")
async def update_project(project_id: str, request: Dict[str, Any]):
    """Update project"""
    try:
        success = project_manager.update_project(project_id, request)
        
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Get updated project
        project = project_manager.get_project(project_id)
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@router.delete("/{project_id}")
async def delete_project(project_id: str):
    """Delete project"""
    try:
        success = project_manager.delete_project(project_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {"success": True, "message": "Project deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

@router.post("/{project_id}/data/{data_type}")
async def save_project_data(project_id: str, data_type: str, request: Dict[str, Any]):
    """Save project-specific data"""
    try:
        # Verify project exists
        project = project_manager.get_project(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        data_id = project_manager.save_project_data(project_id, data_type, request)
        
        return {
            "success": True,
            "dataId": data_id,
            "projectId": project_id,
            "dataType": data_type
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save data: {str(e)}")

@router.get("/{project_id}/data/{data_type}")
async def get_project_data(project_id: str, data_type: str):
    """Get project-specific data"""
    try:
        data = project_manager.get_project_data(project_id, data_type)
        
        if not data:
            return {"data": None, "exists": False}
        
        return {
            "data": data["data"],
            "exists": True,
            "dataId": data["id"],
            "createdAt": data["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get data: {str(e)}")

@router.post("/{project_id}/duplicate")
async def duplicate_project(project_id: str):
    """Duplicate existing project"""
    try:
        # Get original project
        original = project_manager.get_project(project_id)
        if not original:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Create duplicate
        duplicate_data = {
            "name": f"{original['name']} (Copy)",
            "description": original.get("description", ""),
            "videoPath": original.get("video_path", ""),
            "audioPath": original.get("audio_path", ""),
            "resolution": original.get("resolution", "1920x1080"),
            "duration": original.get("duration", 0),
            "fps": original.get("fps", 30),
            "thumbnail": original.get("thumbnail", ""),
            "metadata": original.get("metadata", {}),
            "fileSize": original.get("file_size", 0)
        }
        
        new_project = project_manager.create_project(duplicate_data)
        
        # Copy timeline data
        timeline_data = project_manager.get_project_data(project_id, "timeline")
        if timeline_data:
            project_manager.save_project_data(
                new_project["id"], 
                "timeline", 
                timeline_data["data"]
            )
        
        return {
            "success": True,
            "originalProjectId": project_id,
            "newProjectId": new_project["id"],
            "newProject": new_project
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to duplicate project: {str(e)}")

@router.get("/search")
async def search_projects(query: str):
    """Search projects by name or description"""
    try:
        all_projects = project_manager.get_all_projects()
        
        # Simple search
        results = []
        query_lower = query.lower()
        
        for project in all_projects:
            name_match = query_lower in project.get("name", "").lower()
            desc_match = query_lower in project.get("description", "").lower()
            
            if name_match or desc_match:
                results.append(project)
        
        return {
            "query": query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/stats")
async def get_project_stats():
    """Get project statistics"""
    try:
        projects = project_manager.get_all_projects()
        
        total_size = sum(p.get("file_size", 0) for p in projects)
        avg_duration = sum(p.get("duration", 0) for p in projects) / len(projects) if projects else 0
        
        # Count by resolution
        resolution_counts = {}
        for p in projects:
            res = p.get("resolution", "unknown")
            resolution_counts[res] = resolution_counts.get(res, 0) + 1
        
        # Recent projects (last 7 days)
        seven_days_ago = datetime.now().timestamp() - (7 * 24 * 60 * 60)
        recent_count = 0
        
        return {
            "totalProjects": len(projects),
            "totalSizeBytes": total_size,
            "averageDuration": round(avg_duration, 2),
            "resolutionBreakdown": resolution_counts,
            "recentProjects": recent_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")