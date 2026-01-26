import React, { useState } from 'react';
import { Type, Plus, Trash2, Move, Palette, Shadow, Layers } from 'lucide-react';

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  shadowColor?: string;
  shadowBlur?: number;
  backgroundColor?: string;
  strokeWidth?: number;
  strokeColor?: string;
}

const TextPanel: React.FC = () => {
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: '1',
      text: 'بسم الله الرحمن الرحيم',
      x: 50,
      y: 50,
      fontSize: 48,
      fontFamily: 'Amiri',
      color: '#ffffff',
      opacity: 1,
      shadowColor: '#000000',
      shadowBlur: 4,
    },
  ]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const handleAddText = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'نص جديد',
      x: 100,
      y: 100,
      fontSize: 36,
      fontFamily: 'Amiri',
      color: '#ffffff',
      opacity: 1,
    };
    setTextLayers(prev => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  const handleDeleteLayer = (id: string) => {
    setTextLayers(prev => prev.filter(layer => layer.id !== id));
    if (selectedLayer === id) setSelectedLayer(null);
  };

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  };

  const selectedText = textLayers.find(layer => layer.id === selectedLayer);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">النصوص</h3>
        </div>
        <button
          onClick={handleAddText}
          className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
          title="إضافة نص"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Text Layers List */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {textLayers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => setSelectedLayer(layer.id)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedLayer === layer.id
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Move className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-white truncate">{layer.text}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLayer(layer.id);
                }}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {textLayers.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            لا توجد طبقات نصية
          </div>
        )}
      </div>

      {/* Text Properties */}
      {selectedText && (
        <div className="space-y-4 pt-4 border-t border-slate-700/50">
          <h4 className="text-sm font-medium text-slate-300">خصائص النص</h4>

          {/* Text Content */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">المحتوى</label>
            <textarea
              value={selectedText.text}
              onChange={(e) => updateLayer(selectedText.id, { text: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white text-sm resize-none"
              dir="auto"
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">الخط</label>
            <select
              value={selectedText.fontFamily}
              onChange={(e) => updateLayer(selectedText.id, { fontFamily: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white text-sm cursor-pointer"
            >
              <option value="Amiri">Amiri</option>
              <option value="Cairo">Cairo</option>
              <option value="Noto Naskh Arabic">Noto Naskh Arabic</option>
              <option value="Scheherazade New">Scheherazade New</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">حجم الخط: {selectedText.fontSize}px</label>
            <input
              type="range"
              min={12}
              max={120}
              value={selectedText.fontSize}
              onChange={(e) => updateLayer(selectedText.id, { fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">اللون</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedText.color}
                onChange={(e) => updateLayer(selectedText.id, { color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={selectedText.color}
                onChange={(e) => updateLayer(selectedText.id, { color: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm font-mono"
              />
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              الشفافية: {Math.round(selectedText.opacity * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={selectedText.opacity}
              onChange={(e) => updateLayer(selectedText.id, { opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Shadow */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1">
              <Shadow className="w-3 h-3" />
              الظل
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedText.shadowColor || '#000000'}
                  onChange={(e) => updateLayer(selectedText.id, { shadowColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="number"
                  value={selectedText.shadowBlur || 0}
                  onChange={(e) => updateLayer(selectedText.id, { shadowBlur: parseInt(e.target.value) })}
                  placeholder="Blur"
                  className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Stroke */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">الحد</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedText.strokeColor || '#ffffff'}
                onChange={(e) => updateLayer(selectedText.id, { strokeColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="number"
                value={selectedText.strokeWidth || 0}
                onChange={(e) => updateLayer(selectedText.id, { strokeWidth: parseInt(e.target.value) })}
                placeholder="Width"
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextPanel;
