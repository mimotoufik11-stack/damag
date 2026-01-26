import React, { useState, useEffect } from 'react';
import { Upload, Video, Music, Image, Search, Filter, Grid, List, Trash2, MoreVertical } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
  addedAt: string;
}

const MediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadMediaItems();
  }, []);

  const loadMediaItems = async () => {
    // Load media from API
    const items: MediaItem[] = [
      {
        id: '1',
        name: 'intro.mp4',
        type: 'video',
        url: '/media/intro.mp4',
        duration: 15,
        size: 45000000,
        addedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'background.mp3',
        type: 'audio',
        url: '/media/background.mp3',
        duration: 180,
        size: 8000000,
        addedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'thumbnail.png',
        type: 'image',
        url: '/media/thumbnail.png',
        size: 2500000,
        addedAt: new Date().toISOString(),
      },
    ];
    setMediaItems(items);
  };

  const handleUpload = async () => {
    try {
      const result = await window.electronAPI.dialog.openFile({
        title: 'اختر ملفات الوسائط',
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Media Files', extensions: ['mp4', 'mov', 'mp3', 'wav', 'jpg', 'png', 'webp'] },
        ],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        // Upload files to backend
        const newItems = result.filePaths.map((filePath, index) => ({
          id: `new_${Date.now()}_${index}`,
          name: filePath.split('/').pop() || 'Unknown',
          type: filePath.endsWith('.mp3') || filePath.endsWith('.wav') ? 'audio' as const :
                filePath.endsWith('.jpg') || filePath.endsWith('.png') ? 'image' as const : 'video' as const,
          url: filePath,
          size: 0,
          addedAt: new Date().toISOString(),
        }));
        setMediaItems(prev => [...newItems, ...prev]);
      }
    } catch (error) {
      console.error('Failed to upload:', error);
    }
  };

  const handleDelete = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      case 'image': return Image;
      default: return Video;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-400 bg-blue-500/20';
      case 'audio': return 'text-emerald-400 bg-emerald-500/20';
      case 'image': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">مكتبة الوسائط</h3>
        </div>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          رفع ملفات
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الوسائط..."
            className="w-full pr-10 pl-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-slate-500 text-sm"
          />
        </div>

        <button
          onClick={() => setFilterType(filterType === 'all' ? 'video' : filterType === 'video' ? 'audio' : filterType === 'audio' ? 'image' : 'all')}
          className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-colors"
          title="تصفية"
        >
          <Filter className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-colors"
          title="تغيير العرض"
        >
          {viewMode === 'grid' ? <Grid className="w-4 h-4 text-slate-400" /> : <List className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        {[
          { id: 'all', name: 'الكل' },
          { id: 'video', name: 'فيديو' },
          { id: 'audio', name: 'صوت' },
          { id: 'image', name: 'صور' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterType === filter.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* Media Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-2">لا توجد ملفات</p>
          <button
            onClick={handleUpload}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
          >
            ارفع ملفات الآن
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredItems.map(item => {
            const Icon = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                className="group relative aspect-square rounded-lg bg-slate-800/30 border border-slate-700/50 overflow-hidden hover:border-emerald-500/50 transition-all"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-16 h-16 text-slate-600 group-hover:text-emerald-400/50 transition-colors" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      {item.duration && (
                        <span className="text-xs text-slate-300">{formatDuration(item.duration)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 left-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>

                <button className="absolute top-2 right-2 p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredItems.map(item => {
            const Icon = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all group"
              >
                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{formatSize(item.size)}</span>
                    {item.duration && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(item.duration)}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
