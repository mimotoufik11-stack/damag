import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download, Upload, Trash2, Search, Eye, Type } from 'lucide-react';

interface Font {
  id: string;
  name: string;
  family: string;
  file: string;
  preview: string;
  isInstalled: boolean;
  size: number;
}

const FontsPage: React.FC = () => {
  const navigate = useNavigate();
  const [fonts, setFonts] = useState<Font[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewText, setPreviewText] = useState('بسم الله الرحمن الرحيم');
  const [selectedFont, setSelectedFont] = useState<Font | null>(null);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    // Load fonts from API or local storage
    const systemFonts: Font[] = [
      {
        id: '1',
        name: 'Amiri',
        family: 'Amiri',
        file: 'amiri.ttf',
        preview: 'بسم الله الرحمن الرحيم',
        isInstalled: true,
        size: 145000,
      },
      {
        id: '2',
        name: 'Cairo',
        family: 'Cairo',
        file: 'cairo.ttf',
        preview: 'بسم الله الرحمن الرحيم',
        isInstalled: true,
        size: 210000,
      },
      {
        id: '3',
        name: 'Noto Naskh Arabic',
        family: 'Noto Naskh Arabic',
        file: 'noto-naskh.ttf',
        preview: 'بسم الله الرحمن الرحيم',
        isInstalled: true,
        size: 180000,
      },
    ];
    setFonts(systemFonts);
  };

  const handleUploadFont = async () => {
    try {
      const result = await window.electronAPI.dialog.openFile({
        title: 'اختر ملف الخط',
        filters: [
          { name: 'Font Files', extensions: ['ttf', 'otf', 'woff', 'woff2'] },
        ],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        // Upload font to backend
        const filePath = result.filePaths[0];
        const fontName = filePath.split('/').pop()?.replace(/\.(ttf|otf|woff|woff2)$/, '') || 'Untitled';
        
        const newFont: Font = {
          id: Date.now().toString(),
          name: fontName,
          family: fontName,
          file: filePath,
          preview: previewText,
          isInstalled: true,
          size: 0, // Would get actual size from backend
        };

        setFonts(prev => [...prev, newFont]);
      }
    } catch (error) {
      console.error('Failed to upload font:', error);
    }
  };

  const handleDeleteFont = (fontId: string) => {
    setFonts(prev => prev.filter(f => f.id !== fontId));
  };

  const filteredFonts = fonts.filter(font =>
    font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    font.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen p-8" dir="rtl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">إدارة الخطوط</h1>
              <p className="text-slate-400">إدارة وتثبيت الخطوط العربية</p>
            </div>
          </div>
          <button
            onClick={handleUploadFont}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white font-medium"
          >
            <Upload className="w-4 h-4" />
            إضافة خط
          </button>
        </div>
      </header>

      {/* Search and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن خط..."
              className="w-full pr-12 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="نص معاينة..."
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Fonts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFonts.map((font) => (
          <div
            key={font.id}
            className={`p-6 rounded-2xl border-2 transition-all backdrop-blur-sm ${
              selectedFont?.id === font.id
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
            }`}
            onClick={() => setSelectedFont(font)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-700/50">
                  <Type className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{font.name}</h3>
                  <p className="text-sm text-slate-400">{font.family}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download font logic would go here
                  }}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="تحميل"
                >
                  <Download className="w-4 h-4 text-slate-400 hover:text-emerald-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFont(font.id);
                  }}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                </button>
              </div>
            </div>

            {/* Preview */}
            <div
              className="p-4 bg-slate-900/50 rounded-xl mb-4"
              style={{ fontFamily: font.family }}
            >
              <p className="text-2xl text-white">{previewText}</p>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>الحجم: {formatSize(font.size)}</span>
              <span>•</span>
              <span className={font.isInstalled ? 'text-emerald-400' : 'text-amber-400'}>
                {font.isInstalled ? 'مثبت' : 'غير مثبت'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredFonts.length === 0 && (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <Type className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">لا توجد خطوط</p>
          <p className="text-slate-500">قم بإضافة خطوط جديدة للبدء</p>
        </div>
      )}

      {/* Recommended Fonts */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">خطوط مقترحة للقرآن</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Amiri Qalam', description: 'خط نسخي أنيق للقرآن' },
            { name: 'Scheherazade New', description: 'خط واضح للقراءة' },
            { name: 'Lateef', description: 'خط نثري للشروحات' },
          ].map((font, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-white mb-1">{font.name}</h3>
              <p className="text-sm text-slate-400">{font.description}</p>
              <button className="mt-3 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                تحميل ←
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FontsPage;
