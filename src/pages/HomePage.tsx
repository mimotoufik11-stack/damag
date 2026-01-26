import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useProject } from '../hooks/useProject';
import ProjectCard from '../components/ProjectCard';
import { BookOpen, Plus, Settings, Type, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  lastModified: string;
  duration?: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { recentProjects, fetchRecentProjects } = useProject();
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    const data = await fetchRecentProjects();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleNewProject = () => {
    navigate('/new-project');
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  return (
    <div className="min-h-screen p-8" dir="rtl">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 mb-2 font-amiri">
              دماج للقرآن الكريم
            </h1>
            <p className="text-slate-400 text-lg">محرر فيديو احترافي للمحتوى القرآني</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all border border-slate-700/50 backdrop-blur-sm"
              title="الإعدادات"
            >
              <Settings className="w-6 h-6 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <button
          onClick={handleNewProject}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 hover:from-emerald-500/30 hover:to-emerald-700/30 transition-all border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-all">
              <Plus className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-lg font-semibold text-white">مشروع جديد</span>
          </div>
        </button>

        <button
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-800/20 hover:from-amber-500/30 hover:to-amber-700/30 transition-all border border-amber-500/30 hover:border-amber-400/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-xl bg-amber-500/20 group-hover:bg-amber-500/30 transition-all">
              <BookOpen className="w-8 h-8 text-amber-400" />
            </div>
            <span className="text-lg font-semibold text-white">فتح مشروع</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/fonts')}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-800/20 hover:from-purple-500/30 hover:to-purple-700/30 transition-all border border-purple-500/30 hover:border-purple-400/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-all">
              <Type className="w-8 h-8 text-purple-400" />
            </div>
            <span className="text-lg font-semibold text-white">إدارة الخطوط</span>
          </div>
        </button>

        <button className="group relative p-6 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 transition-all border border-cyan-500/30 hover:border-cyan-400/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-all">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-lg font-semibold text-white">أدوات الذكاء الاصطناعي</span>
          </div>
        </button>
      </div>

      {/* Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">المشاريع الأخيرة</h2>
          {projects.length > 0 && (
            <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
              عرض الكل
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">لا توجد مشاريع بعد</p>
            <p className="text-slate-500">ابدأ بإنشاء مشروع جديد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => handleOpenProject(project.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="text-3xl font-bold text-emerald-400 mb-2">{projects.length}</div>
          <div className="text-slate-400">إجمالي المشاريع</div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="text-3xl font-bold text-amber-400 mb-2">
            {projects.reduce((acc, p) => acc + (p.duration || 0), 0) / 60}
          </div>
          <div className="text-slate-400">دقائق من المحتوى</div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
          <div className="text-slate-400">مشاريع منشورة</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
