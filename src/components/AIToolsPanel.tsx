import React, { useState } from 'react';
import { Wand, Mic2, FileText, Volume2, Sparkles, Zap, Clock, AlertCircle } from 'lucide-react';

interface AIJob {
  id: string;
  type: 'transcribe' | 'dub' | 'subtitle' | 'denoise';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
}

const AIToolsPanel: React.FC = () => {
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [activeTab, setActiveTab] = useState<'tools' | 'jobs'>('tools');

  const handleTranscribe = () => {
    const newJob: AIJob = {
      id: Date.now().toString(),
      type: 'transcribe',
      status: 'running',
      progress: 0,
    };
    setJobs(prev => [newJob, ...prev]);
    setActiveTab('jobs');

    // Simulate progress
    const interval = setInterval(() => {
      setJobs(prev =>
        prev.map(job =>
          job.id === newJob.id
            ? { ...job, progress: Math.min(job.progress + Math.random() * 15, 100) }
            : job
        )
      );
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setJobs(prev =>
        prev.map(job =>
          job.id === newJob.id ? { ...job, status: 'completed' as const, progress: 100 } : job
        )
      );
    }, 7000);
  };

  const handleDub = () => {
    const newJob: AIJob = {
      id: Date.now().toString(),
      type: 'dub',
      status: 'running',
      progress: 0,
    };
    setJobs(prev => [newJob, ...prev]);
    setActiveTab('jobs');
  };

  const handleGenerateSubtitles = () => {
    const newJob: AIJob = {
      id: Date.now().toString(),
      type: 'subtitle',
      status: 'running',
      progress: 0,
    };
    setJobs(prev => [newJob, ...prev]);
    setActiveTab('jobs');
  };

  const handleDenoise = () => {
    const newJob: AIJob = {
      id: Date.now().toString(),
      type: 'denoise',
      status: 'running',
      progress: 0,
    };
    setJobs(prev => [newJob, ...prev]);
    setActiveTab('jobs');
  };

  const getJobStatusIcon = (status: AIJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-slate-400" />;
      case 'running':
        return <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />;
      case 'completed':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getJobTypeLabel = (type: AIJob['type']) => {
    switch (type) {
      case 'transcribe': return 'تحويل الصوت لنص';
      case 'dub': return 'التعليق الصوتي';
      case 'subtitle': return 'توليد ترجمة';
      case 'denoise': return 'تقليل الضوضاء';
    }
  };

  const aiTools = [
    {
      id: 'transcribe',
      title: 'تحويل الصوت لنص',
      description: 'استخراج النص من الصوت باستخدام Whisper',
      icon: Mic2,
      color: 'from-emerald-600/20 to-emerald-800/20',
      borderColor: 'border-emerald-500/30',
      onClick: handleTranscribe,
    },
    {
      id: 'dub',
      title: 'التعليق الصوتي',
      description: 'توليد صوت عربي باستخدام TTS',
      icon: Volume2,
      color: 'from-purple-600/20 to-purple-800/20',
      borderColor: 'border-purple-500/30',
      onClick: handleDub,
    },
    {
      id: 'subtitle',
      title: 'توليد ترجمة',
      description: 'إنشاء ترجمة آلية للفيديو',
      icon: FileText,
      color: 'from-amber-600/20 to-amber-800/20',
      borderColor: 'border-amber-500/30',
      onClick: handleGenerateSubtitles,
    },
    {
      id: 'denoise',
      title: 'تقليل الضوضاء',
      description: 'تنظيف الصوت من الضوضاء الخلفية',
      icon: Sparkles,
      color: 'from-cyan-600/20 to-cyan-800/20',
      borderColor: 'border-cyan-500/30',
      onClick: handleDenoise,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Wand className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">الذكاء الاصطناعي</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeTab === 'tools'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          الأدوات
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeTab === 'jobs'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          المهام ({jobs.filter(j => j.status !== 'completed').length})
        </button>
      </div>

      {activeTab === 'tools' ? (
        <div className="space-y-3">
          {aiTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={tool.onClick}
                className={`w-full p-4 rounded-xl border-2 bg-gradient-to-r ${tool.color} ${tool.borderColor} hover:opacity-80 transition-all text-right`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/50 flex-shrink-0">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{tool.title}</h4>
                    <p className="text-sm text-slate-400">{tool.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              لا توجد مهام نشطة
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  job.status === 'running'
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : job.status === 'completed'
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : job.status === 'failed'
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-slate-700/50 bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getJobStatusIcon(job.status)}
                    <span className="text-white text-sm font-medium">
                      {getJobTypeLabel(job.type)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {job.status === 'completed' ? 'مكتمل' : job.status === 'running' ? 'جاري التنفيذ...' : job.status === 'failed' ? 'فشل' : 'انتظار'}
                  </span>
                </div>

                {job.status === 'running' && (
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                )}

                {job.status === 'completed' && (
                  <button className="mt-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    عرض النتيجة ←
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* AI Info */}
      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <h4 className="text-sm font-medium text-slate-300 mb-2">معلومات الذكاء الاصطناعي</h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>المحرك:</span>
            <span className="text-white">OpenAI Whisper</span>
          </div>
          <div className="flex justify-between">
            <span>النموذج:</span>
            <span className="text-white">Base-v2</span>
          </div>
          <div className="flex justify-between">
            <span>اللغات المدعومة:</span>
            <span className="text-white">+99 لغة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsPanel;
