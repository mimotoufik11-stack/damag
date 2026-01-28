from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import uvicorn
import os

from routers import video, audio, whisper, quran, projects, export
from models import database

app = FastAPI(
    title="Dammaj Al-Quran API",
    description="Backend API for Quran video editing application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/output", StaticFiles(directory="output"), name="output")

app.include_router(video.router, prefix="/video", tags=["video"])
app.include_router(audio.router, prefix="/audio", tags=["audio"])
app.include_router(whisper.router, prefix="/whisper", tags=["whisper"])
app.include_router(quran.router, prefix="/quran", tags=["quran"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(export.router, prefix="/export", tags=["export"])

@app.get("/")
async def root():
    return {"message": "Dammaj Al-Quran API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )