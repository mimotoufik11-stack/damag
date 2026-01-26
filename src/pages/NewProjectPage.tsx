import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { ArrowRight, FolderOpen, Video, Film } from 'lucide-react';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resolution: '1920x1080',
    frameRate: 30,
    duration: 60,
  });
  const [importMedia, setImportMedia] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const project = await createProject({
      name: formData.name,
      description: formData.description,
      settings: {
        resolution: formData.resolution,
        frameRate: formData.frameRate,
        duration: formData.duration,
      },
    });

    if (project) {
      navigate(`/editor/${project.id}`);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" dir="rtl">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 mb-2 font-amiri">
            إنشاء مشروع جديد
          </h1>
          <p className="text-slate-400">ابدأ مشروعك القرآني الجديد</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              اسم المشروع <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-500 transition-all"
              placeholder="مثال: سورة الفاتحة"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-500 transition-all resize-none"
              placeholder="وصف مختصر للمشروع..."
            />
          </div>

          {/* Project Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                الدقة
              </label>
              <select
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all cursor-pointer"
              >
                <option value="1920x1080">Full HD (1920×1080)</option>
                <option value="1280x720">HD (1280×720)</option>
                <option value="3840x2160">4K (3840×2160)</option>
                <option value="1280x720">YouTube (1280×720)</option>
                <option value="1080x1920">Instagram (1080×1920)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                معدل الإطارات (FPS)
              </label>
              <select
                value={formData.frameRate}
                onChange={(e) => setFormData({ ...formData, frameRate: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all cursor-pointer"
              >
                <option value={24}>24 fps</option>
                <option value={30}>30 fps</option>
                <option value={60}>60 fps</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                المدة المبدئية (ثواني)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min={10}
                max={3600}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all"
              />
            </div>
          </div>

          {/* Import Media Option */}
          <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <input
              type="checkbox"
              id="importMedia"
              checked={importMedia}
              onChange={(e) => setImportMedia(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
            />
            <label htmlFor="importMedia" className="flex items-center gap-2 cursor-pointer">
              <Video className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">استيراد ملفات وسائط فور إنشاء المشروع</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors text-white font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors text-white font-medium flex items-center justify-center gap-2"
            >
              <Film className="w-5 h-5" />
              إنشاء المشروع
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectPage;
