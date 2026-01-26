import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ArrowRight, Save, Moon, Sun, Monitor, HardDrive, Database, Globe, Bell } from 'lucide-react';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  autoSave: boolean;
  autoSaveInterval: number;
  exportPath: string;
  exportQuality: 'low' | 'medium' | 'high';
  exportFormat: 'mp4' | 'webm';
  notifications: boolean;
  hardwareAcceleration: boolean;
  maxUndoHistory: number;
  cacheSize: number;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof Settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
  };

  const handleSelectExportPath = async () => {
    try {
      const result = await window.electronAPI.dialog.openDirectory({
        title: 'اختر مجلد التصدير الافتراضي',
      });
      if (!result.canceled && result.filePaths.length > 0) {
        handleChange('exportPath', result.filePaths[0]);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  return (
    <div className="min-h-screen p-8" dir="rtl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
            <p className="text-slate-400">تخصيص إعدادات التطبيق</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Appearance */}
        <section className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">المظهر</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">السمة</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', icon: Sun, label: 'فاتح' },
                  { value: 'dark', icon: Moon, label: 'داكن' },
                  { value: 'system', icon: Monitor, label: 'النظام' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange('theme', option.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      localSettings.theme === option.value
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 ${localSettings.theme === option.value ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-sm text-slate-300">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">اللغة</label>
              <select
                value={localSettings.language}
                onChange={(e) => handleChange('language', e.target.value as 'ar' | 'en')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white transition-all cursor-pointer"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        {/* Project Settings */}
        <section className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">إعدادات المشروع</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">الحفظ التلقائي</div>
                <div className="text-sm text-slate-400">حفظ المشروع تلقائياً بشكل دوري</div>
              </div>
              <button
                onClick={() => handleChange('autoSave', !localSettings.autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.autoSave ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {localSettings.autoSave && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  فترة الحفظ التلقائي (دقائق)
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={localSettings.autoSaveInterval}
                  onChange={(e) => handleChange('autoSaveInterval', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-slate-400 mt-2">
                  {localSettings.autoSaveInterval} دقيقة
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                حد سجل التراجع
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={localSettings.maxUndoHistory}
                onChange={(e) => handleChange('maxUndoHistory', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white transition-all"
              />
            </div>
          </div>
        </section>

        {/* Export Settings */}
        <section className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <HardDrive className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">إعدادات التصدير</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                مسار التصدير الافتراضي
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localSettings.exportPath || ''}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300"
                  placeholder="اختر مجلد..."
                />
                <button
                  type="button"
                  onClick={handleSelectExportPath}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors text-white"
                >
                  <FolderOpen className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">الجودة الافتراضية</label>
                <select
                  value={localSettings.exportQuality}
                  onChange={(e) => handleChange('exportQuality', e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white transition-all cursor-pointer"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">الصيغة الافتراضية</label>
                <select
                  value={localSettings.exportFormat}
                  onChange={(e) => handleChange('exportFormat', e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white transition-all cursor-pointer"
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">إعدادات النظام</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">تسريع العتاد</div>
                <div className="text-sm text-slate-400">استخدام GPU لتسريع المعالجة</div>
              </div>
              <button
                onClick={() => handleChange('hardwareAcceleration', !localSettings.hardwareAcceleration)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.hardwareAcceleration ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.hardwareAcceleration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">الإشعارات</div>
                <div className="text-sm text-slate-400">إظهار إشعارات النظام</div>
              </div>
              <button
                onClick={() => handleChange('notifications', !localSettings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors text-white font-medium"
          >
            استعادة الافتراضيات
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors text-white font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            حفظ الإعدادات
          </button>
        </div>

        {saved && (
          <div className="text-center text-emerald-400 font-medium animate-pulse">
            ✓ تم حفظ الإعدادات بنجاح
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
