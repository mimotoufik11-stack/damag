"""
Dammaj Al-Quran - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import logging

from config import settings
from logger import setup_logger
from middleware import error_handler_middleware
from routers import (
    projects,
    media,
    timeline,
    subtitles,
    ai,
    audio,
    fonts,
    export,
)
from database.db import init_db

# Setup logging
logger = setup_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting Dammaj Al-Quran Backend...")
    
    # Initialize database
    await init_db()
    logger.info("Database initialized")
    
    yield
    
    logger.info("Shutting down Dammaj Al-Quran Backend...")


# Create FastAPI app
app = FastAPI(
    title="Dammaj Al-Quran API",
    description="Professional Quran video editing backend API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom error handler middleware
app.middleware("http")(error_handler_middleware)

# Include routers
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(media.router, prefix="/api/media", tags=["Media"])
app.include_router(timeline.router, prefix="/api/timeline", tags=["Timeline"])
app.include_router(subtitles.router, prefix="/api/subtitles", tags=["Subtitles"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(audio.router, prefix="/api/audio", tags=["Audio"])
app.include_router(fonts.router, prefix="/api/fonts", tags=["Fonts"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Dammaj Al-Quran API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
