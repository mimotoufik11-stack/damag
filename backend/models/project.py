"""Project model"""

from sqlalchemy import Column, String, Integer, DateTime, Text, JSON
from sqlalchemy.sql import func
from database.base import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    settings = Column(JSON, nullable=True)
    metadata = Column(JSON, nullable=True)
    thumbnail = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "settings": self.settings,
            "metadata": self.metadata,
            "thumbnail": self.thumbnail,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
