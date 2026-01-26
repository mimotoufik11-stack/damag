import React, { useState } from 'react';
import { Volume2, VolumeX, AudioWaveform, Music, Mic, Settings, Sliders } from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  type: 'music' | 'voice' | 'effect';
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
}

const AudioPanel: React.FC = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([
    { id: '1', name: 'background.mp3', type: 'music', volume: 80, pan: 0, isMuted: false, isSolo: false },
    { id: '2', name: 'voice.mp3', type: 'voice', volume: 90, pan: 0, isMuted: false, isSolo: false },
  ]);
  const [masterVolume, setMasterVolume] = useState(100);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const updateTrack = (id: string, updates: Partial<AudioTrack>) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === id ? { ...track, ...updates } : track
      )
    );
  };

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'music': return Music;
      case 'voice': return Mic;
      default: return AudioWaveform;
    }
  };

  const getTrackColor = (type: string) => {
    switch (type) {
      case 'music': return 'text-purple-400';
      case 'voice': return 'text-emerald-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">الصوت</h3>
      </div>

      {/* Master Volume */}
      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">المستوى الرئيسي</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMasterVolume(prev => prev === 0 ? 100 : 0)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {masterVolume === 0 ? (
              <VolumeX className="w-5 h-5 text-slate-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={100}
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <span className="text-sm text-slate-300 w-12 text-left">{masterVolume}%</span>
        </div>
      </div>

      {/* Audio Tracks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">المقاطع الصوتية</span>
          <button className="text-emerald-400 hover:text-emerald-300 text-sm">
            + إضافة
          </button>
        </div>

        {tracks.map((track) => {
          const TrackIcon = getTrackIcon(track.type);
          return (
            <div
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedTrack === track.id
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              {/* Track Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-700/50 ${getTrackColor(track.type)}`}>
                    <TrackIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{track.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{track.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTrack(track.id, { isMuted: !track.isMuted });
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      track.isMuted ? 'bg-red-500/20 text-red-400' : 'hover:bg-slate-700/50 text-slate-400'
                    }`}
                    title="كتم الصوت"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTrack(track.id, { isSolo: !track.isSolo });
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      track.isSolo ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700/50 text-slate-400'
                    }`}
                    title="منفرد"
                  >
                    S
                  </button>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={track.volume}
                    onChange={(e) => updateTrack(track.id, { volume: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <span className="text-xs text-slate-300 w-8">{track.volume}%</span>
              </div>

              {/* Pan */}
              <div className="flex items-center gap-2 mt-2">
                <Sliders className="w-4 h-4 text-slate-400" />
                <div className="flex-1 flex items-center">
                  <span className="text-xs text-slate-400">R</span>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={track.pan}
                    onChange={(e) => updateTrack(track.id, { pan: parseInt(e.target.value) })}
                    className="flex-1 mx-2"
                  />
                  <span className="text-xs text-slate-400">L</span>
                </div>
                <span className="text-xs text-slate-300 w-8 text-center">{track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audio Effects */}
      <div className="pt-4 border-t border-slate-700/50">
        <h4 className="text-sm font-medium text-slate-300 mb-3">المؤثرات الصوتية</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'تقليل الضوضاء', value: 'noise-reduction' },
            { name: 'التطبيع', value: 'normalize' },
            { name: 'الصدى', value: 'reverb' },
            { name: 'تعديل النبرة', value: 'pitch' },
          ].map((effect) => (
            <button
              key={effect.value}
              className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm transition-colors text-center"
            >
              {effect.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPanel;
