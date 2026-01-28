import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateSubtitle, clearSubtitles } from '../store/editorStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  preview: string;
  category: 'minimal' | 'modern' | 'islamic' | 'professional' | 'bold' | 'elegant' | 'dark' | 'neon' | 'vintage' | 'custom';
  styles: {
    fontFamily: string;
    fontSize: number;
    fontWeight: 100 | 300 | 400 | 700 | 900;
    color: string;
    background: string;
    shadow: string;
    stroke: string;
    strokeWidth: number;
    glow: string;
    position: 'top' | 'bottom' | 'center';
    effect: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'pulse' | 'typewriter';
  };
  videoEffects: Array<{
    type: 'brightness' | 'contrast' | 'saturation' | 'hue' | 'blur' | 'sharpen' | 'colorGrading' | 'vignette' | 'pixelate' | 'invert';
    value: number;
  }>;
  custom?: boolean;
}

const templates: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white text on dark background',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBbWlyaSIgZm9udC1zaXplPSI4IiBmaWxsPSIjRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+6K6h5aSc5aS8PC90ZXh0Pjwvc3ZnPg==',
    preview: '',
    category: 'minimal',
    styles: {
      fontFamily: 'Amiri',
      fontSize: 48,
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.5)',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
      stroke: '#000000',
      strokeWidth: 1,
      glow: '0 0 0 rgba(0, 0, 0, 0)',
      position: 'bottom',
      effect: 'fade',
    },
    videoEffects: [],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Gradient backgrounds with smooth animations',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NzJFO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzNDEENTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+PC9zdmc+',
    preview: '',
    category: 'modern',
    styles: {
      fontFamily: 'Cairo',
      fontSize: 56,
      fontWeight: 700,
      color: 'rgba(255, 255, 255, 1)',
      background: 'linear-gradient(45deg, rgba(102, 114, 234, 0.7), rgba(51, 65, 213, 0.7))',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
      stroke: '#FFFFFF',
      strokeWidth: 1,
      glow: '0 0 8px rgba(255, 255, 255, 0.3)',
      position: 'center',
      effect: 'scale',
    },
    videoEffects: [
      { type: 'contrast', value: 110 },
      { type: 'saturation', value: 120 },
    ],
  },
  {
    id: 'islamic',
    name: 'Islamic',
    description: 'Gold accents with traditional patterns',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiM4QjQ1MTMiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJTY2NoZXJhemFkZSIgZm9udC1zaXplPSI4IiBmaWxsPSIjRkZENzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+6K6h5aSc5aS8PC90ZXh0Pjwvc3ZnPg==',
    preview: '',
    category: 'islamic',
    styles: {
      fontFamily: 'Scheherazade',
      fontSize: 64,
      fontWeight: 700,
      color: 'rgba(255, 215, 0, 1)',
      background: 'rgba(139, 69, 19, 0.6)',
      shadow: '0 3px 10px rgba(0, 0, 0, 0.8)',
      stroke: '#8B4513',
      strokeWidth: 2,
      glow: '0 0 10px rgba(255, 215, 0, 0.5)',
      position: 'bottom',
      effect: 'pulse',
    },
    videoEffects: [
      { type: 'brightness', value: 105 },
      { type: 'vignette', value: 30 },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, centered corporate style',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiMxOTE5MTkiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJNb250c2VycmF0IiBmb250LXNpemU9IjgiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7orqHlpJzlpLw8L3RleHQ+PC9zdmc+',
    preview: '',
    category: 'professional',
    styles: {
      fontFamily: 'Montserrat, Helvetica',
      fontSize: 42,
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 0.95)',
      background: 'rgba(25, 25, 25, 0.7)',
      shadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
      stroke: 'none',
      strokeWidth: 0,
      glow: 'none',
      position: 'bottom',
      effect: 'none',
    },
    videoEffects: [],
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Large, high contrast text',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNGRkYiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjgiIGZpbGw9IiMwMDAiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+6K6h5aSc5aS8PC90ZXh0Pjwvc3ZnPg==',
    preview: '',
    category: 'bold',
    styles: {
      fontFamily: 'Lalezar',
      fontSize: 72,
      fontWeight: 900,
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.8)',
      shadow: '0 4px 16px rgba(0, 0, 0, 0.9)',
      stroke: '#000000',
      strokeWidth: 3,
      glow: 'none',
      position: 'center',
      effect: 'slide',
    },
    videoEffects: [
      { type: 'contrast', value: 130 },
      { type: 'sharpen', value: 80 },
    ],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Script font with subtle shadows',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiMyRjJGMkYiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJUZW1wb3JhbmMiIGZvbnQtc2l6ZT0iNiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuCukOWxgOCuleC5iOCuljE8L3RleHQ+PC9zdmc+',
    preview: '',
    category: 'elegant',
    styles: {
      fontFamily: 'Katibeh',
      fontSize: 48,
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 0.9)',
      background: 'rgba(47, 47, 47, 0.5)',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
      stroke: '#FFFFFF',
      strokeWidth: 1,
      glow: '0 0 6px rgba(255, 255, 255, 0.2)',
      position: 'bottom',
      effect: 'typewriter',
    },
    videoEffects: [
      { type: 'blur', value: 2 },
    ],
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Light text on dark background',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJSb2JvdG8iIGZvbnQtc2l6ZT0iOCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuCukOWxgOCuleC5iOCuljE8L3RleHQ+PC9zdmc+',
    preview: '',
    category: 'dark',
    styles: {
      fontFamily: 'Roboto',
      fontSize: 44,
      fontWeight: 300,
      color: 'rgba(240, 240, 240, 1)',
      background: 'rgba(51, 51, 51, 0.7)',
      shadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
      stroke: 'none',
      strokeWidth: 0,
      glow: 'none',
      position: 'bottom',
      effect: 'none',
    },
    videoEffects: [
      { type: 'brightness', value: 90 },
      { type: 'contrast', value: 110 },
    ],
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Glowing text effects',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjMDBGRjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBzdHlsZT0iZmlsdGVyOiBibHVyKDJweCk7IiBkeT0iLjNlbSI+4K6Q5bGA4K6V4LmI4K6WMTwvdGV4dD48L3N2Zz4=',
    preview: '',
    category: 'neon',
    styles: {
      fontFamily: 'Cairo',
      fontSize: 52,
      fontWeight: 700,
      color: 'rgba(0, 255, 0, 1)',
      background: 'rgba(0, 0, 0, 0.4)',
      shadow: '0 0 0 rgba(0, 0, 0, 0)',
      stroke: '#000000',
      strokeWidth: 1,
      glow: '0 0 12px rgba(0, 255, 0, 0.8)',
      position: 'center',
      effect: 'bounce',
    },
    videoEffects: [
      { type: 'contrast', value: 140 },
    ],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Sepia tones and decorative borders',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNDOTk5NzciLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJTZ3JhdGVmZiIgZmlsbD0iIzhCNDUxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuCukOWxgOCuleC5iOCuljE8L3RleHQ+PC9zdmc+',
    preview: '',
    category: 'vintage',
    styles: {
      fontFamily: 'Markazi Text',
      fontSize: 48,
      fontWeight: 400,
      color: 'rgba(139, 69, 19, 1)',
      background: 'rgba(201, 153, 119, 0.6)',
      shadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
      stroke: '#654321',
      strokeWidth: 2,
      glow: 'none',
      position: 'bottom',
      effect: 'fade',
    },
    videoEffects: [
      { type: 'hue', value: 30 },
      { type: 'saturation', value: 70 },
      { type: 'contrast', value: 90 },
      { type: 'vignette', value: 40 },
    ],
  },
];

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  subtitleId?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ open, onClose, subtitleId }) => {
  const dispatch = useDispatch();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleTemplateApply = () => {
    if (!subtitleId) {
      dispatch(clearSubtitles());
      onClose();
      return;
    }

    dispatch(updateSubtitle({
      id: subtitleId,
      updates: {
        fontFamily: selectedTemplate.styles.fontFamily,
        fontSize: selectedTemplate.styles.fontSize,
        fontWeight: selectedTemplate.styles.fontWeight,
        color: selectedTemplate.styles.color,
        background: selectedTemplate.styles.background,
        shadow: selectedTemplate.styles.shadow,
        stroke: selectedTemplate.styles.stroke,
        strokeWidth: selectedTemplate.styles.strokeWidth,
        glow: selectedTemplate.styles.glow,
        position: selectedTemplate.styles.position,
        effect: selectedTemplate.styles.effect,
      }
    }));
    
    onClose();
  };

  const handleCreateCustomTemplate = () => {
    const currentState = {
      id: 'custom-' + Date.now(),
      name: 'Custom Template',
      description: 'User created template',
      thumbnail: '',
      preview: '',
      category: 'custom',
      styles: {
        fontFamily: 'Amiri',
        fontSize: 48,
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 1)',
        background: 'rgba(0, 0, 0, 0.5)',
        shadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        stroke: '#000000',
        strokeWidth: 1,
        glow: 'none',
        position: 'bottom' as const,
        effect: 'none' as const,
      },
      videoEffects: [],
      custom: true,
    };
    
    templates.push(currentState);
    alert('Custom template saved!');
  };

  const renderPreview = (template: Template) => {
    return (
      <Box
        sx={{
          p: 2,
          background: template.styles.background.includes('gradient') ? template.styles.background : 'transparent',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: template.styles.fontFamily,
            fontSize: template.styles.fontSize,
            fontWeight: template.styles.fontWeight,
            color: template.styles.color,
            textShadow: template.styles.shadow.includes('0 0 0') ? 'none' : template.styles.shadow,
            textDecoration: template.styles.stroke ? `stroke ${template.styles.stroke} ${template.styles.strokeWidth}px` : 'none',
            filter: template.styles.glow ? `drop-shadow(${template.styles.glow})` : 'none',
            textAlign: 'center',
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Professional Templates</Typography>
        <Button
          variant="outlined"
          onClick={handleCreateCustomTemplate}
          startIcon={<SaveIcon />}
          size="small"
        >
          Save Current as Template
        </Button>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Template Gallery */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {templates.map((template) => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <Card
                    sx={{
                      border: selectedTemplate.id === template.id ? '3px solid #1976d2' : '1px solid #e0e0e0',
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                    }}
                  >
                    <CardActionArea onClick={() => handleTemplateSelect(template)}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={template.thumbnail}
                        alt={template.name}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {template.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Preview & Settings */}
          <Grid item xs={12} md={4}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Preview: {selectedTemplate.name}
              </Typography>
              
              <Box
                sx={{
                  height: 200,
                  background: 'linear-gradient(45deg, #2C2C2C, #1C1C1C)',
                  borderRadius: 1,
                  mb: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedTemplate.styles.background.includes('gradient')
                      ? 'transparent'
                      : selectedTemplate.styles.background,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: selectedTemplate.styles.fontFamily,
                      fontSize: selectedTemplate.styles.fontSize,
                      fontWeight: selectedTemplate.styles.fontWeight,
                      color: selectedTemplate.styles.color,
                      textShadow: selectedTemplate.styles.shadow.includes('0 0 0') ? 'none' : selectedTemplate.styles.shadow,
                      textAlign: 'center',
                      maxWidth: '80%',
                    }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" gutterBottom>Template Details</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Font: {selectedTemplate.styles.fontFamily}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Size: {selectedTemplate.styles.fontSize}px
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Position: {selectedTemplate.styles.position}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Effect: {selectedTemplate.styles.effect}
              </Typography>
              
              {selectedTemplate.videoEffects.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Video Effects</Typography>
                  {selectedTemplate.videoEffects.map((effect, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • {effect.type}: {effect.value}
                    </Typography>
                  ))}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleTemplateApply}
          variant="contained"
          disabled={!selectedTemplate}
        >
          Apply Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateSelector;