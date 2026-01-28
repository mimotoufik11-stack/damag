import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setSubtitleStyle, setEffectValue, setEffectEnabled } from '../store/editorStore';
import { HexColorPicker } from 'react-colorful';

interface PropertiesPanelProps {
  onFontUpload?: (file: File) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ onFontUpload }) => {
  const { currentProject, selectedClipId, fonts, templates } = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('text');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || '');
  const [fontSize, setFontSize] = useState(60);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#000000');
  const [bgOpacity, setBgOpacity] = useState(0.5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    // Update selected subtitle style
    if (currentProject?.subtitles && currentProject.subtitles.length > 0) {
      const track = currentProject.subtitles[0];
      const subtitle = track.subtitles.find(s => s.id === selectedClipId);
      if (subtitle) {
        dispatch(setSubtitleStyle({
          subtitleId: subtitle.id,
          style: {
            ...subtitle.style,
            fontSize: value,
          },
        }));
      }
    }
  };

  const handleColorChange = (color: string) => {
    setFontColor(color);
    // Update selected subtitle text color
    if (currentProject?.subtitles && currentProject.subtitles.length > 0) {
      const track = currentProject.subtitles[0];
      const subtitle = track.subtitles.find(s => s.id === selectedClipId);
      if (subtitle) {
        dispatch(setSubtitleStyle({
          subtitleId: subtitle.id,
          style: {
            ...subtitle.style,
            color: color,
          },
        }));
      }
    }
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
  };

  const handleBgOpacityChange = (value: number) => {
    setBgOpacity(value);
  };

  const handleTemplateApply = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && currentProject) {
      // Apply template styling to subtitles
      const track = currentProject.subtitles[0];
      if (track) {
        track.subtitles.forEach(subtitle => {
          dispatch(setSubtitleStyle({
            subtitleId: subtitle.id,
            style: {
              ...subtitle.style,
              ...template.configuration.text,
            },
          }));
        });
      }
    }
  };

  const handleEffectToggle = (effectType: string) => {
    const effect = currentProject?.effects.find(e => e.type === effectType);
    if (effect) {
      dispatch(setEffectEnabled({ effectId: effect.id, enabled: !effect.enabled }));
    }
  };

  const handleEffectValueChange = (effectType: string, value: number) => {
    const effect = currentProject?.effects.find(e => e.type === effectType);
    if (effect) {
      dispatch(setEffectValue({ effectId: effect.id, value }));
    }
  };

  return (
    <div className="w-96 bg-gray-800 text-white h-full overflow-y-auto" dir="rtl">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {['text', 'effects', 'templates', 'audio', 'export'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 py-2 text-sm ${
              selectedTab === tab ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {tab === 'text' && 'نص'}
            {tab === 'effects' && 'التأثيرات'}
            {tab === 'templates' && 'قوالب'}
            {tab === 'audio' && 'ماعدات الصوت'}
            {tab === 'export' && 'تصدير'}
          </button>
        ))}
      </div>

      {/* Text Tab */}
      {selectedTab === 'text' && (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">ملف النص</h3>
          
          {/* Font Selection */}
          <div>
            <label className="block text-sm mb-1">الخط</label>
            <select className="w-full bg-gray-700 rounded px-3 py-2">
              {fonts.map((font, index) => (
                <option key={index} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm mb-1">حجم الخط</label>
            <input
              type="range"
              min="20"
              max="120"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-center">{fontSize}px</div>
          </div>

          {/* Text Color */}
          <div className="relative">
            <label className="block text-sm mb-1">لون النص</label>
            <div 
              className="w-full h-8 rounded cursor-pointer"
              style={{ backgroundColor: fontColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <div className="absolute z-10 mt-1">
                <HexColorPicker color={fontColor} onChange={handleColorChange} />
              </div>
            )}
          </div>

          {/* Background Settings */}
          <div>
            <h4 className="text-md font-semibold mt-4 mb-2">صإسقة الخلفية</h4>
            
            <label className="block text-sm mb-1">لون الخلفية</label>
            <div 
              className="w-full h-8 rounded cursor-pointer"
              style={{ backgroundColor: bgColor }}
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            />
            {showBgColorPicker && (
              <div className="absolute z-10 mt-1">
                <HexColorPicker color={bgColor} onChange={handleBgColorChange} />
              </div>
            )}

            <label className="block text-sm mt-3 mb-1">ظ③لُفِ</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={bgOpacity}
              onChange={(e) => handleBgOpacityChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Shadow Settings */}
          <div>
            <h4 className="text-md font-semibold mt-4 mb-2">آثارات افخليل</h4>
            <label className="block text-sm mb-1">لون الواجهة</label>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={5}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {selectedTab === 'effects' && (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">آثارات مقدسة</h3>
          
          {['brightness', 'contrast', 'saturation', 'blur'].map(effectType => (
            <div key={effectType} className="border border-gray-700 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span>{effectType === 'brightness' && 'سيطوع'
                  || effectType === 'contrast' && 'تباين'
                  || effectType === 'saturation' && 'تشجيعات'
                  || effectType === 'blur' && 'ضبابية'}</span>
                <input
                  type="checkbox"
                  onChange={() => handleEffectToggle(effectType)}
                  checked={currentProject?.effects.some(e => e.type === effectType && e.enabled) || false}
                />
              </div>
              <input
                type="range"
                min={effectType === 'brightness' ? -100 : 0}
                max={effectType === 'blur' ? 50 : 200}
                defaultValue={effectType === 'brightness' ? 0 : 100}
                onChange={(e) => handleEffectValueChange(effectType, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">القئطب الاحترفية</h3>
          
          {templates.map(template => (
            <div
              key={template.id}
              className={`border rounded p-3 cursor-pointer ${
                selectedTemplate === template.id ? 'border-blue-500 bg-blue-900 bg-opacity-30' : 'border-gray-700'
              }`}
              onClick={() => {
                setSelectedTemplate(template.id);
                handleTemplateApply(template.id);
              }}
            >
              <h4 className="font-semibold">{template.name}</h4>
              <p className="text-gray-300">{template.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Export Tab */}
      {selectedTab === 'export' && (
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">إخراج الملفات</h3>
          
          <div>
            <label className="block text-sm mb-1">نوع الإخراج</label>
            <select className="w-full bg-gray-700 rounded px-3 py-2">
              <option>1920x1080 (Full HD)</option>
              <option>1280x720 (HD)</option>
              <option>3840x2160 (4K)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1;">نوع الملف</label>
            <select className="w-full bg-gray-700 rounded px-3 py-2">
              <option>MP4</option>
              <option>MOV</option>
              <option>WebM</option>
            </select>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold">
            تصديرالملف
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;