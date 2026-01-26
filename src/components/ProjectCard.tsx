import React from 'react';
import { Clock, Calendar, Video } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    lastModified: string;
    duration?: number;
  };
  onOpen: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <button
      onClick={onOpen}
      className="w-full text-right group"
    >
      <div className="relative aspect-video rounded-xl bg-slate-800/50 border-2 border-slate-700/50 overflow-hidden mb-3 group-hover:border-emerald-500/50 transition-all">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Video className="w-12 h-12 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
        )}

        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs font-medium">
          {formatDuration(project.duration)}
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 rounded-full bg-emerald-500/90 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white mr-[-2px]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-slate-400 truncate">{project.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(project.lastModified)}
          </span>
          {project.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(project.duration)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ProjectCard;
