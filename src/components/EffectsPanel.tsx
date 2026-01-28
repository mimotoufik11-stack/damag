import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addVideoEffect, updateVideoEffect, removeVideoEffect } from '../store/editorStore';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Slider,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  MovieFilter,
  Opacity,
  Contrast,
  Gradient,
  Texture,
  BlurOn,
  BrightnessHigh,
  Style,
} from '@mui/icons-material';

interface EffectPreset {
  id: string;
  name: string;
  description: string;
  category: 'color' | 'filter' | 'transform';
  effects: Array<{
    type: string;
    value: number;
  }>;
}

const effectPresets: EffectPreset[] = [
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Old film look with sepia tones',
    category: 'filter',
    effects: [
      { type: 'saturation', value: 60 },
      { type: 'contrast', value: 90 },
      { type: 'brightness', value: 95 },
      { type: 'hue', value: 30 },
    ],
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast cinematic look',
    category: 'color',
    effects: [
      { type: 'contrast', value: 130 },
      { type: 'saturation', value: 110 },
      { type: 'brightness', value: 105 },
    ],
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    description: 'Soft blur with high brightness',
    category: 'filter',
    effects: [
      { type: 'blur', value: 3 },
      { type: 'brightness', value: 110 },
      { type: 'saturation', value: 120 },
    ],
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Black and white film noir',
    category: 'filter',
    effects: [
      { type: 'saturation', value: 0 },
      { type: 'contrast', value: 140 },
      { type: 'brightness', value: 90 },
    ],
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Golden hour warmth',
    category: 'color',
    effects: [
      { type: 'hue', value: -10 },
      { type: 'saturation', value: 115 },
      { type: 'brightness', value: 102 },
    ],
  },
  {
    id: 'cold',
    name: 'Cold',
    description: 'Cool blue tones',
    category: 'color',
    effects: [
      { type: 'hue', value: 180 },
      { type: 'saturation', value: 85 },
      { type: 'brightness', value: 98 },
    ],
  },
];

const videoEffectTypes = [
  { type: 'brightness', name: 'Brightness', min: -100, max: 100, default: 0, unit: '%' },
  { type: 'contrast', name: 'Contrast', min: 0, max: 200, default: 100, unit: '%' },
  { type: 'saturation', name: 'Saturation', min: 0, max: 200, default: 100, unit: '%' },
  { type: 'hue', name: 'Hue', min: -180, max: 180, default: 0, unit: '°' },
  { type: 'blur', name: 'Blur', min: 0, max: 50, default: 0, unit: 'px' },
  { type: 'sharpen', name: 'Sharpen', min: 0, max: 100, default: 0, unit: '%' },
  { type: 'vignette', name: 'Vignette', min: 0, max: 100, default: 0, unit: '%' },
  { type: 'pixelate', name: 'Pixelate', min: 2, max: 32, default: 2, unit: 'px' },
];

const subtitleEffectTypes = [
  { type: 'fade', name: 'Fade In/Out', description: 'Smooth opacity transition' },
  { type: 'slide', name: 'Slide', description: 'Enter from direction' },
  { type: 'scale', name: 'Scale', description: 'Zoom in/out animation' },
  { type: 'bounce', name: 'Bounce', description: 'Bouncy entrance effect' },
  { type: 'pulse', name: 'Pulse', description: 'Continuous pulsing' },
  { type: 'typewriter', name: 'Typewriter', description: 'Character by character reveal' },
  { type: 'blur', name: 'Blur Transition', description: 'Blur in/out' },
  { type: 'zoom', name: 'Zoom', description: 'Zoom and pan effect' },
  { type: 'rotate', name: 'Rotate', description: 'Rotate animation' },
  { type: 'slide-up', name: 'Slide Up', description: 'Slide from bottom' },
];

interface EffectsPanelProps {
  subtitleId?: string;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({ subtitleId }) => {
  const dispatch = useDispatch();
  const effects = useSelector((state: RootState) => state.editor.effects);
  
  const [selectedPreset, setSelectedPreset] = useState<EffectPreset | null>(null);
  const [selectedVideoEffect, setSelectedVideoEffect] = useState<string>('brightness');
  const [selectedSubtitleEffect, setSelectedSubtitleEffect] = useState<string>('fade');
  
  // Video effect values
  const [videoEffectValues, setVideoEffectValues] = useState<Record<string, number>>({
    brightness: 0,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sharpen: 0,
    vignette: 0,
    pixelate: 2,
  });

  // Subtitle effect settings
  const [subtitleEffectSettings, setSubtitleEffectSettings] = useState({
    duration: 500,
    easing: 'ease-in-out' as 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out',
    direction: 'left' as 'left' | 'right' | 'top' | 'bottom',
    intensity: 50,
  });

  const applyEffectPreset = (preset: EffectPreset) => {
    preset.effects.forEach(effect => {
      const existingEffect = effects.find(e => e.type === effect.type);
      if (existingEffect) {
        dispatch(updateVideoEffect({
          id: existingEffect.id,
          updates: { value: effect.value }
        }));
      } else {
        dispatch(addVideoEffect({
          name: `${effect.type} (${preset.name})`,
          type: effect.type as any,
          value: effect.value,
        }));
      }
    });
    setSelectedPreset(preset);
  };

  const addVideoEffectHandler = (type: string) => {
    const effectType = videoEffectTypes.find(e => e.type === type);
    if (!effectType) return;

    const newEffect = {
      name: effectType.name,
      type: type as any,
      value: videoEffectValues[type],
    };
    dispatch(addVideoEffect(newEffect));
  };

  const updateVideoEffectHandler = (type: string, value: number) => {
    const existingEffect = effects.find(e => e.type === type);
    if (existingEffect) {
      dispatch(updateVideoEffect({
        id: existingEffect.id,
        updates: { value }
      }));
    }
  };

  const removeVideoEffectHandler = (effectId: string) => {
    dispatch(removeVideoEffect(effectId));
  };

  const applySubtitleEffect = () => {
    if (!subtitleId) return;
    
    // Apply to subtitle through the store
    // This would integrate with the subtitle update mechanism
    console.log('Applying subtitle effect:', {
      effect: selectedSubtitleEffect,
      settings: subtitleEffectSettings,
    });
  };

  const handleEffectValueChange = (effectType: string, value: number) => {
    setVideoEffectValues(prev => ({ ...prev, [effectType]: value }));
    updateVideoEffectHandler(effectType, value);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MovieFilter />
        Video Effects & Filters
      </Typography>

      {/* Effect Presets */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Effect Presets</Typography>
        <Grid container spacing={2}>
          {effectPresets.map((preset) => (
            <Grid item xs={12} sm={6} md={4} key={preset.id}>
              <Card
                sx={{
                  border: selectedPreset?.id === preset.id ? '3px solid #1976d2' : '1px solid #e0e0e0',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 },
                }}
                onClick={() => applyEffectPreset(preset)}
              >
                <CardContent>
                  <Typography variant="subtitle2">{preset.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {preset.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip label={preset.category} size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Video Effects Controls */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Video Effect Controls</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Effect</InputLabel>
              <Select
                value={selectedVideoEffect}
                onChange={(e) => setSelectedVideoEffect(e.target.value)}
                label="Select Effect"
              >
                {videoEffectTypes.map((effect) => (
                  <MenuItem key={effect.type} value={effect.type}>
                    {effect.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {videoEffectTypes
              .filter(e => e.type === selectedVideoEffect)
              .map((effect) => (
                <Box key={effect.type}>
                  <Typography variant="body2">
                    {effect.name}: {videoEffectValues[effect.type]}{effect.unit}
                  </Typography>
                  <Slider
                    value={videoEffectValues[effect.type]}
                    onChange={(_, value) => handleEffectValueChange(effect.type, value as number)}
                    min={effect.min}
                    max={effect.max}
                    valueLabelDisplay="auto"
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => addVideoEffectHandler(effect.type)}
                      disabled={effects.some(e => e.type === effect.type)}
                    >
                      Add Effect
                    </Button>
                  </Box>
                </Box>
              ))}
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Active Effects</Typography>
          {effects.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No effects added. Select an effect above and click "Add Effect".
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {effects.map((effect) => (
                <Chip
                  key={effect.id}
                  label={`${effect.name}: ${effect.value}`}
                  onDelete={() => removeVideoEffectHandler(effect.id)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Subtitle Effects */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Subtitle Animation Effects</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Animation Type</InputLabel>
              <Select
                value={selectedSubtitleEffect}
                onChange={(e) => setSelectedSubtitleEffect(e.target.value)}
                label="Animation Type"
              >
                {subtitleEffectTypes.map((effect) => (
                  <MenuItem key={effect.type} value={effect.type}>
                    {effect.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {subtitleEffectTypes
              .filter(e => e.type === selectedSubtitleEffect)
              .map((effect) => (
                <Box key={effect.type}>
                  <Typography variant="body2" gutterBottom>
                    {effect.name} - {effect.description}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption">Duration (ms)</Typography>
                      <Slider
                        value={subtitleEffectSettings.duration}
                        onChange={(_, value) => setSubtitleEffectSettings(prev => ({ ...prev, duration: value as number }))}
                        min={100}
                        max={3000}
                        step={100}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption">Intensity</Typography>
                      <Slider
                        value={subtitleEffectSettings.intensity}
                        onChange={(_, value) => setSubtitleEffectSettings(prev => ({ ...prev, intensity: value as number }))}
                        min={10}
                        max={100}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Easing</InputLabel>
                        <Select
                          value={subtitleEffectSettings.easing}
                          onChange={(e) => setSubtitleEffectSettings(prev => ({ ...prev, easing: e.target.value as any }))}
                          label="Easing"
                        >
                          <MenuItem value="linear">Linear</MenuItem>
                          <MenuItem value="ease-in">Ease In</MenuItem>
                          <MenuItem value="ease-out">Ease Out</MenuItem>
                          <MenuItem value="ease-in-out">Ease In Out</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {selectedSubtitleEffect === 'slide' && (
                      <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Direction</InputLabel>
                          <Select
                            value={subtitleEffectSettings.direction}
                            onChange={(e) => setSubtitleEffectSettings(prev => ({ ...prev, direction: e.target.value as any }))}
                            label="Direction"
                          >
                            <MenuItem value="left">Left</MenuItem>
                            <MenuItem value="right">Right</MenuItem>
                            <MenuItem value="top">Top</MenuItem>
                            <MenuItem value="bottom">Bottom</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ))}
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={applySubtitleEffect}
            disabled={!subtitleId}
            size="small"
          >
            Apply to Subtitle
          </Button>
          {!subtitleId && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              Select a subtitle to apply effects
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Effect Preview */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>Effect Preview</Typography>
        <Box
          sx={{
            height: 200,
            backgroundColor: '#2C2C2C',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Preview Area
          </Typography>
          
          {/* Subtitle preview */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '8px 16px',
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Amiri',
                color: 'white',
                fontSize: 18,
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EffectsPanel;