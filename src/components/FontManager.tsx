import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateSubtitle } from '../store/editorStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import {
  Add,
  Delete,
  Upload,
} from '@mui/icons-material';

const builtinFonts = [
  { family: 'Amiri', variant: 'serif', language: 'عربي' },
  { family: 'Scheherazade', variant: 'serif', language: 'عربي' },
  { family: 'Cairo', variant: 'sans-serif', language: 'عربي' },
  { family: 'Lalezar', variant: 'display', language: 'عربي' },
  { family: 'Mada', variant: 'sans-serif', language: 'عربي' },
  { family: 'Tajawal', variant: 'sans-serif', language: 'عربي' },
  { family: 'Almarai', variant: 'sans-serif', language: 'عربي' },
  { family: 'Changa', variant: 'sans-serif', language: 'عربي' },
  { family: 'Reem Kufi', variant: 'sans-serif', language: 'عربي' },
  { family: 'Harmattan', variant: 'sans-serif', language: 'عربي' },
  { family: 'Noto Sans Arabic', variant: 'sans-serif', language: 'عربي' },
  { family: 'Noto Naskh Arabic', variant: 'serif', language: 'عربي' },
  { family: 'Lateef', variant: 'serif', language: 'عربي' },
  { family: 'Jomhuria', variant: 'display', language: 'عربي' },
  { family: 'Markazi Text', variant: 'serif', language: 'عربي' },
  { family: 'El Messiri', variant: 'serif', language: 'عربي' },
  { family: 'Aref Ruqaa', variant: 'serif', language: 'عربي' },
  { family: 'Rakkas', variant: 'cursive', language: 'عربي' },
  { family: 'Mirza', variant: 'serif', language: 'عربي' },
  { family: 'Katibeh', variant: 'serif', language: 'عربي' },
];

const arabicSample = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const englishSample = "Bismillah Ar-Rahman Ar-Raheem";

interface FontManagerProps {
  open: boolean;
  onClose: () => void;
  subtitleId?: string;
}

const FontManager: React.FC<FontManagerProps> = ({ open, onClose, subtitleId }) => {
  const dispatch = useDispatch();
  const subtitle = useSelector((state: RootState) =>
    state.editor.subtitleTrack.find(s => s.id === subtitleId)
  );

  const [selectedFont, setSelectedFont] = useState(builtinFonts[0].family);
  const [fontSize, setFontSize] = useState(subtitle?.fontSize || 48);
  const [fontWeight, setFontWeight] = useState<100 | 300 | 400 | 700 | 900>(subtitle?.fontWeight || 400);
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [kerning, setKerning] = useState(subtitle?.kerning || 0);
  const [letterSpacing, setLetterSpacing] = useState(subtitle?.letterSpacing || 0);
  const [lineHeight, setLineHeight] = useState(subtitle?.lineHeight || 1.2);
  const [textTransform, setTextTransform] = useState<'normal' | 'uppercase' | 'lowercase'>(subtitle?.transform || 'normal');
  
  const [customFonts, setCustomFonts] = useState<Array<{ name: string; file: File }>>([]);

  const handleFontApply = () => {
    if (subtitleId) {
      dispatch(updateSubtitle({
        id: subtitleId,
        updates: {
          fontFamily: selectedFont,
          fontSize,
          fontWeight,
          kerning,
          letterSpacing,
          lineHeight,
          transform: textTransform,
        }
      }));
    }
    onClose();
  };

  const handleFontSelect = (fontFamily: string) => {
    setSelectedFont(fontFamily);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type === 'font/ttf' || file.type === 'font/otf' || file.name.endsWith('.ttf') || file.name.endsWith('.otf')) {
          setCustomFonts(prev => [...prev, { name: file.name, file }]);
        }
      });
    }
  };

  const renderFontPreview = (fontFamily: string) => (
    <Box sx={{ p: 2 }}>
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        {fontFamily}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          fontFamily: fontFamily,
          fontSize: fontSize,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          letterSpacing: `${letterSpacing}px`,
          lineHeight: lineHeight,
          textTransform: textTransform,
        }}
      >
        {arabicSample}
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          fontFamily: fontFamily,
          fontSize: Math.max(12, fontSize * 0.6),
          fontWeight: fontWeight,
        }}
      >
        {englishSample}
      </Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Font Management</DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Custom Font Upload</Typography>
          <input
            accept=".ttf,.otf"
            style={{ display: 'none' }}
            id="upload-font"
            type="file"
            multiple
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-font">
            <Button variant="outlined" component="span" startIcon={<Upload />}>
              Upload Fonts (.ttf, .otf)
            </Button>
          </label>
          
          {customFonts.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Uploaded Fonts:</Typography>
              {customFonts.map((font, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #eee', borderRadius: 1, mt: 1 }}>
                  <Typography variant="body2">{font.name}</Typography>
                  <IconButton size="small" onClick={() => setCustomFonts(prev => prev.filter((_, i) => i !== index))}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>Built-in Arabic Fonts</Typography>
        
        <Grid container spacing={2} sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {builtinFonts.map((font) => (
            <Grid item xs={12} sm={6} key={font.family}>
              <Card 
                sx={{ 
                  border: selectedFont === font.family ? '3px solid #1976d2' : '1px solid #e0e0e0',
                  transition: 'all 0.3s',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                <CardActionArea onClick={() => handleFontSelect(font.family)}>
                  <CardContent sx={{ p: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: font.family,
                        mb: 0.5
                      }}
                    >
                      {arabicSample}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {font.family}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {font.variant} • {font.language}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle1" gutterBottom>Font Properties</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Font Size</Typography>
            <Slider
              value={fontSize}
              onChange={(_, value) => setFontSize(value as number)}
              min={8}
              max={200}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption">{fontSize}px</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Font Weight</Typography>
            <FormControl fullWidth size="small">
              <Select value={fontWeight} onChange={(e) => setFontWeight(e.target.value as any)}>
                <MenuItem value={100}>Thin (100)</MenuItem>
                <MenuItem value={300}>Light (300)</MenuItem>
                <MenuItem value={400}>Normal (400)</MenuItem>
                <MenuItem value={700}>Bold (700)</MenuItem>
                <MenuItem value={900}>Black (900)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Kerning</Typography>
            <Slider
              value={kerning}
              onChange={(_, value) => setKerning(value as number)}
              min={-2}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Letter Spacing</Typography>
            <Slider
              value={letterSpacing}
              onChange={(_, value) => setLetterSpacing(value as number)}
              min={-5}
              max={20}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption">{letterSpacing}px</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Line Height</Typography>
            <Slider
              value={lineHeight}
              onChange={(_, value) => setLineHeight(value as number)}
              min={0.8}
              max={2.5}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">Text Transform</Typography>
            <FormControl fullWidth size="small">
              <Select value={textTransform} onChange={(e) => setTextTransform(e.target.value as any)}>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="uppercase">Uppercase</MenuItem>
                <MenuItem value="lowercase">Lowercase</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2" gutterBottom>Preview</Typography>
          {renderFontPreview(selectedFont)}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleFontApply} variant="contained">
          {subtitleId ? 'Apply to Subtitle' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FontManager;