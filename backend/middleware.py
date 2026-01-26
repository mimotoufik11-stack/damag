"""Custom middleware"""

from fastapi import Request, HTTPException
from logger import logger


async def error_handler_middleware(request: Request, call_next):
    """Global error handler middleware"""
    try:
        response = await call_next(request)
        return response
    except HTTPException as e:
        logger.error(f"HTTP error: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
