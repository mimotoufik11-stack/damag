import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateSubtitle } from '../store/editorStore';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Colorize,
  Palette,
  Opacity as OpacityIcon,
  Gradient as GradientIcon,
  Shadow as ShadowIcon,
  FormatColorReset,
} from '@mui/icons-material';

const colorPresets = [
  '#FFFFFF', '#000000', '#FF1744', '#E91E63', '#9C27B0',
  '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#009688',
  '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
  '#FF9800', '#FF5722', '#795548', '#607D8B', '#9E9E9E'
];

interface ColorPanelProps {
  subtitleId?: string;
}

const ColorPanel: React.FC<ColorPanelProps> = ({ subtitleId }) => {
  const dispatch = useDispatch();
  
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textOpacity, setTextOpacity] = useState(100);
  
  const [bgColor, setBgColor] = useState('rgba(0, 0, 0, 0.5)');
  const [bgOpacity, setBgOpacity] = useState(50);
  const [bgGradient, setBgGradient] = useState(false);
  const [bgGradientType, setBgGradientType] = useState<'linear' | 'radial'>('linear');
  const [bgGradientColors, setBgGradientColors] = useState(['#000000', '#333333']);
  
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(8);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(2);
  const [shadowOpacity, setShadowOpacity] = useState(50);
  
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  
  const [glowColor, setGlowColor] = useState('#FFFFFF');
  const [glowBlur, setGlowBlur] = useState(0);
  
  const [textBlur, setTextBlur] = useState(0);
  const [textBrightness, setTextBrightness] = useState(0);
  const [textContrast, setTextContrast] = useState(100);
  const [textSaturation, setTextSaturation] = useState(100);
  
  const [textDecoration, setTextDecoration] = useState('none');

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const applyStyles = () => {
    if (!subtitleId) return;
    
    const shadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${hexToRgba(shadowColor, shadowOpacity)}`;
    const glow = `0 0 ${glowBlur}px ${glowColor}`;
    
    dispatch(updateSubtitle({
      id: subtitleId,
      updates: {
        color: hexToRgba(textColor, textOpacity),
        background: bgGradient ? 
          (bgGradientType === 'linear' ? 
            `linear-gradient(45deg, ${bgGradientColors.join(', ')})` : 
            `radial-gradient(circle, ${bgGradientColors.join(', ')})`) : 
          bgColor,
        shadow,
        stroke: strokeColor,
        strokeWidth,
        glow,
        blur: textBlur,
      }
    }));
  };

  const resetStyles = () => {
    setTextColor('#FFFFFF');
    setTextOpacity(100);
    setBgColor('rgba(0, 0, 0, 0.5)');
    setBgOpacity(50);
    setShadowColor('#000000');
    setShadowBlur(8);
    setShadowOffsetX(0);
    setShadowOffsetY(2);
    setShadowOpacity(50);
    setStrokeColor('#000000');
    setStrokeWidth(1);
    setGlowColor('#FFFFFF');
    setGlowBlur(0);
    setTextBlur(0);
    setTextBrightness(0);
    setTextContrast(100);
    setTextSaturation(100);
  };

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) => (
    <Box>
      <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ width: 20, height: 20, backgroundColor: value, border: '1px solid #ccc', borderRadius: 1 }} />
            </InputAdornment>
          ),
        }}
        fullWidth
        size="small"
      />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        {colorPresets.slice(0, 10).map((color) => (
          <Box
            key={color}
            onClick={() => onChange(color)}
            sx={{
              width: 24,
              height: 24,
              backgroundColor: color,
              border: '1px solid #ccc',
              borderRadius: '50%',
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* Text Color Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Colorize fontSize="small" />
          Text Color & Opacity
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2">Opacity</Typography>
            <Slider
              value={textOpacity}
              onChange={(_, value) => setTextOpacity(value as number)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              startIcon={<OpacityIcon />}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Background Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <GradientIcon fontSize="small" />
          Background
        </Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <Select
            value={bgGradient ? 'gradient' : 'solid'}
            onChange={(e) => setBgGradient(e.target.value === 'gradient')}
          >
            <MenuItem value="solid">Solid Color</MenuItem>
            <MenuItem value="gradient">Gradient</MenuItem>
          </Select>
        </FormControl>
        
        {bgGradient ? (
          <>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={bgGradientType}
                onChange={(e) => setBgGradientType(e.target.value as 'linear' | 'radial')}
              >
                <MenuItem value="linear">Linear Gradient</MenuItem>
                <MenuItem value="radial">Radial Gradient</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {bgGradientColors.map((color, index) => (
                <ColorPicker
                  key={index}
                  label={`Gradient ${index + 1}`}
                  value={color}
                  onChange={(newColor) => {
                    const newColors = [...bgGradientColors];
                    newColors[index] = newColor;
                    setBgGradientColors(newColors);
                  }}
                />
              ))}
            </Box>
          </>
        ) : (
          <ColorPicker label="Background Color" value={bgColor} onChange={setBgColor} />
        )}
        
        <Typography variant="body2">Background Opacity</Typography>
        <Slider
          value={bgOpacity}
          onChange={(_, value) => setBgOpacity(value as number)}
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Shadow Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ShadowIcon fontSize="small" />
          Shadow/Outline Effects
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ColorPicker label="Shadow Color" value={shadowColor} onChange={setShadowColor} />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2">Blur</Typography>
            <Slider
              value={shadowBlur}
              onChange={(_, value) => setShadowBlur(value as number)}
              min={0}
              max={20}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2">Opacity</Typography>
            <Slider
              value={shadowOpacity}
              onChange={(_, value) => setShadowOpacity(value as number)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              label="Offset X"
              type="number"
              value={shadowOffsetX}
              onChange={(e) => setShadowOffsetX(Number(e.target.value))}
              fullWidth
              size="small"
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              label="Offset Y"
              type="number"
              value={shadowOffsetY}
              onChange={(e) => setShadowOffsetY(Number(e.target.value))}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stroke Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Outline/Stroke</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ColorPicker label="Stroke Color" value={strokeColor} onChange={setStrokeColor} />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2">Stroke Width</Typography>
            <Slider
              value={strokeWidth}
              onChange={(_, value) => setStrokeWidth(value as number)}
              min={1}
              max={10}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Glow Effect */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Glow Effect</Typography>
        
        <ColorPicker label="Glow Color" value={glowColor} onChange={setGlowColor} />
        
        <Typography variant="body2">Glow Blur</Typography>
        <Slider
          value={glowBlur}
          onChange={(_, value) => setGlowBlur(value as number)}
          min={0}
          max={20}
          valueLabelDisplay="auto"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Text Effects */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Text Effects</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Blur</Typography>
            <Slider
              value={textBlur}
              onChange={(_, value) => setTextBlur(value as number)}
              min={0}
              max={20}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2">Brightness</Typography>
            <Slider
              value={textBrightness}
              onChange={(_, value) => setTextBrightness(value as number)}
              min={-100}
              max={100}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2">Contrast (%)</Typography>
            <Slider
              value={textContrast}
              onChange={(_, value) => setTextContrast(value as number)}
              min={0}
              max={200}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2">Saturation (%)</Typography>
            <Slider
              value={textSaturation}
              onChange={(_, value) => setTextSaturation(value as number)}
              min={0}
              max={200}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          onClick={applyStyles}
          fullWidth
          size="small"
        >
          Apply Styles
        </Button>
        <Button
          variant="outlined"
          onClick={resetStyles}
          startIcon={<FormatColorReset />}
          size="small"
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default ColorPanel;