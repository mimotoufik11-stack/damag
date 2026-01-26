import React, { useState } from 'react';
import { Type, Search, Trash2, Star } from 'lucide-react';

interface Font {
  id: string;
  name: string;
  family: string;
  category: 'quran' | 'arabic' | 'english';
  isInstalled: boolean;
  isFavorite?: boolean;
  preview: string;
  size: number;
}

const FontManager: React.FC = () => {
  const [fonts, setFonts] = useState<Font[]>([
    {
      id: '1',
      name: 'Amiri',
      family: 'Amiri',
      category: 'quran',
      isInstalled: true,
      isFavorite: true,
      preview: 'بسم الله الرحمن الرحيم',
      size: 145000,
    },
    {
      id: '2',
      name: 'Cairo',
      family: 'Cairo',
      category: 'arabic',
      isInstalled: true,
      preview: 'بسم الله الرحمن الرحيم',
      size: 210000,
    },
    {
      id: '3',
      name: 'Noto Naskh Arabic',
      family: 'Noto Naskh Arabic',
      category: 'quran',
      isInstalled: true,
      preview: 'بسم الله الرحمن الرحيم',
      size: 180000,
    },
    {
      id: '4',
      name: 'Scheherazade New',
      family: 'Scheherazade New',
      category: 'quran',
      isInstalled: false,
      preview: 'بسم الله الرحمن الرحيم',
      size: 195000,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFonts = fonts.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = (id: string) => {
    setFonts(prev =>
      prev.map(font =>
        font.id === id ? { ...font, isFavorite: !font.isFavorite } : font
      )
    );
  };

  const handleInstall = async (id: string) => {
    // Implement font installation
    setFonts(prev =>
      prev.map(font =>
        font.id === id ? { ...font, isInstalled: !font.isInstalled } : font
      )
    );
  };

  const handleDelete = (id: string) => {
    setFonts(prev => prev.filter(font => font.id !== id));
  };

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'quran', name: 'القرآن' },
    { id: 'arabic', name: 'عربية' },
    { id: 'english', name: 'English' },
  ];

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">الخطوط</h3>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن خط..."
          className="w-full pr-10 pl-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-slate-500 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Font List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredFonts.map(font => (
          <div
            key={font.id}
            className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center overflow-hidden">
                  <span
                    className="text-2xl text-white"
                    style={{ fontFamily: font.family }}
                  >
                    أ
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium">{font.name}</h4>
                    {font.isFavorite && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{font.family} • {formatSize(font.size)}</p>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => handleToggleFavorite(font.id)}
                  className={`p-1.5 rounded transition-colors ${
                    font.isFavorite
                      ? 'text-amber-400 bg-amber-500/20'
                      : 'text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                {font.isInstalled && (
                  <button
                    onClick={() => handleDelete(font.id)}
                    className="p-1.5 rounded text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Preview */}
            <div
              className="p-3 bg-slate-900/50 rounded-lg mb-3 text-center"
              style={{ fontFamily: font.family }}
            >
              <p className="text-lg text-white">{font.preview}</p>
            </div>

            {/* Action */}
            <button
              onClick={() => handleInstall(font.id)}
              className={`w-full py-2 rounded-lg font-medium transition-all ${
                font.isInstalled
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {font.isInstalled ? 'مثبت' : 'تثبيت'}
            </button>
          </div>
        ))}
      </div>

      {filteredFonts.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          لا توجد خطوط مطابقة
        </div>
      )}
    </div>
  );
};

export default FontManager;
