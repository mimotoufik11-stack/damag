import React, { useState } from 'react';
import { Download, Video, Settings, HardDrive } from 'lucide-react';

interface ExportConfig {
  resolution: '720p' | '1080p' | '4K';
  format: 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high';
  frameRate: 24 | 30 | 60;
  audioQuality: '128k' | '256k' | '320k';
  includeSubtitles: boolean;
  burnSubtitles: boolean;
}

interface ExportPanelProps {
  onClose: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onClose: _onClose }) => {
  const [config, setConfig] = useState<ExportConfig>({
    resolution: '1080p',
    format: 'mp4',
    quality: 'high',
    frameRate: 30,
    audioQuality: '256k',
    includeSubtitles: true,
    burnSubtitles: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportPath, setExportPath] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  const handleSelectPath = async () => {
    try {
      const result = await window.electronAPI.dialog.saveFile({
        title: 'حفظ الفيديو',
        defaultPath: `video.${config.format}`,
        filters: [
          { name: 'Video Files', extensions: [config.format] },
        ],
      });

      if (!result.canceled && result.filePath) {
        setExportPath(result.filePath);
      }
    } catch (error) {
      console.error('Failed to select path:', error);
    }
  };

  const resolutions = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '4K': { width: 3840, height: 2160 },
  };

  const _selectedResolution = resolutions[config.resolution];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Download className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">تصدير الفيديو</h3>
      </div>

      {!isExporting ? (
        <>
          {/* Export Path */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">مسار التصدير</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={exportPath || ''}
                readOnly
                placeholder="اختر مسار الحفظ..."
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm"
              />
              <button
                onClick={handleSelectPath}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <HardDrive className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Video Settings */}
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-4">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-medium text-slate-300">إعدادات الفيديو</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">الدقة</label>
                <select
                  value={config.resolution}
                  onChange={(e) => setConfig({ ...config, resolution: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm cursor-pointer"
                >
                  <option value="720p">HD (1280×720)</option>
                  <option value="1080p">Full HD (1920×1080)</option>
                  <option value="4K">4K (3840×2160)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">معدل الإطارات</label>
                <select
                  value={config.frameRate}
                  onChange={(e) => setConfig({ ...config, frameRate: parseInt(e.target.value) as any })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm cursor-pointer"
                >
                  <option value={24}>24 fps</option>
                  <option value={30}>30 fps</option>
                  <option value={60}>60 fps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">الصيغة</label>
                <select
                  value={config.format}
                  onChange={(e) => setConfig({ ...config, format: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm cursor-pointer"
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">الجودة</label>
                <select
                  value={config.quality}
                  onChange={(e) => setConfig({ ...config, quality: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm cursor-pointer"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                </select>
              </div>
            </div>

            {/* Estimated Size */}
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">الحجم المتوقع:</span>
                <span className="text-white font-mono">
                  {config.quality === 'low' ? '~50 MB' : config.quality === 'medium' ? '~150 MB' : '~300 MB'}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-medium text-slate-300">إعدادات الصوت</h4>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">جودة الصوت</label>
              <select
                value={config.audioQuality}
                onChange={(e) => setConfig({ ...config, audioQuality: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm cursor-pointer"
              >
                <option value="128k">128 kbps</option>
                <option value="256k">256 kbps</option>
                <option value="320k">320 kbps</option>
              </select>
            </div>
          </div>

          {/* Subtitle Settings */}
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-3">
            <h4 className="text-sm font-medium text-slate-300">الترجمة</h4>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-400">تضمين الترجمة</span>
              <input
                type="checkbox"
                checked={config.includeSubtitles}
                onChange={(e) => setConfig({ ...config, includeSubtitles: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
              />
            </label>

            {config.includeSubtitles && (
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-400">دمج الترجمة في الفيديو</span>
                <input
                  type="checkbox"
                  checked={config.burnSubtitles}
                  onChange={(e) => setConfig({ ...config, burnSubtitles: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                />
              </label>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={!exportPath}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors text-white font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            بدء التصدير
          </button>
        </>
      ) : (
        /* Export Progress */
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500/30 border-t-emerald-500 mx-auto mb-4"></div>
            <h4 className="text-lg font-semibold text-white mb-2">جاري التصدير...</h4>
            <p className="text-slate-400 text-sm">الرجاء الانتظار</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Details */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{Math.round(progress)}%</div>
              <div className="text-xs text-slate-400">التقدم</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-2xl font-bold text-amber-400">
                {Math.round((progress / 100) * 60)}
              </div>
              <div className="text-xs text-slate-400">ثانية</div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="text-center text-sm text-slate-400">
            الوقت المتبقي: {Math.round((100 - progress) / 10)} ثانية
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => {
              setIsExporting(false);
              setProgress(0);
            }}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white text-sm"
          >
            إلغاء
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
