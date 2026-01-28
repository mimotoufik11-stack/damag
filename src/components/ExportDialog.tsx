import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDispatch } from 'react-redux';
import { updateExportSettings } from '../store/editorStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  VideoFile,
  AudioFile,
  Settings,
  Hd,
  Memory,
  Speed,
} from '@mui/icons-material';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

const videoFormats = [
  { value: 'mp4', label: 'MP4 (H.264)', description: 'Universal compatibility', icon: '📱' },
  { value: 'webm', label: 'WebM (VP9)', description: 'Web optimized', icon: '🌐' },
  { value: 'mov', label: 'MOV (ProRes)', description: 'Professional editing', icon: '🎬' },
  { value: 'avi', label: 'AVI (MPEG-4)', description: 'Legacy format', icon: '📼' },
];

const qualityPresets = [
  { value: 'low', label: 'Low (480p)', resolution: '854x480', maxBitrate: 2000, audioBitrate: 128 },
  { value: 'medium', label: 'Medium (720p)', resolution: '1280x720', maxBitrate: 5000, audioBitrate: 192 },
  { value: 'high', label: 'High (1080p)', resolution: '1920x1080', maxBitrate: 15000, audioBitrate: 320 },
  { value: 'ultra', label: 'Ultra (4K)', resolution: '3840x2160', maxBitrate: 50000, audioBitrate: 320 },
];

const frameRates = [
  { value: 24, label: '24 fps', description: 'Cinematic' },
  { value: 30, label: '30 fps', description: 'Standard' },
  { value: 60, label: '60 fps', description: 'Smooth motion' },
];

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { projectName, videoClips, exportSettings } = useSelector((state: RootState) => state.editor);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('Calculating...');
  const [outputFileName, setOutputFileName] = useState(`${projectName || 'untitled'}_export`);
  
  const [format, setFormat] = useState(exportSettings.format);
  const [quality, setQuality] = useState(exportSettings.quality);
  const [resolution, setResolution] = useState(exportSettings.resolution);
  const [customWidth, setCustomWidth] = useState(exportSettings.customWidth);
  const [customHeight, setCustomHeight] = useState(exportSettings.customHeight);
  const [fps, setFps] = useState(exportSettings.fps);
  const [bitrate, setBitrate] = useState(exportSettings.bitrate);
  const [audioBitrate, setAudioBitrate] = useState(exportSettings.audioBitrate);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    const preset = qualityPresets.find(p => p.value === newQuality);
    if (preset) {
      setBitrate(preset.maxBitrate);
      setAudioBitrate(preset.audioBitrate);
      if (newQuality !== 'custom') {
        const [width, height] = preset.resolution.split('x').map(Number);
        setCustomWidth(width);
        setCustomHeight(height);
      }
    }
  };
  
  const handleResolutionChange = (newResolution: string) => {
    setResolution(newResolution);
    if (newResolution !== 'custom') {
      const preset = qualityPresets.find(p => p.value === quality);
      if (preset) {
        const [width, height] = preset.resolution.split('x').map(Number);
        setCustomWidth(width);
        setCustomHeight(height);
      }
    }
  };
  
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Update export settings in Redux
    dispatch(updateExportSettings({
      format,
      quality,
      resolution,
      customWidth,
      customHeight,
      fps,
      bitrate,
      audioBitrate,
    }));
    
    // Simulate export process
    const duration = videoClips.reduce((total, clip) => total + clip.duration, 0);
    const estimatedSeconds = Math.max(30, duration * 2); // Rough estimate
    
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(95, (elapsed / estimatedSeconds) * 100);
      
      setExportProgress(progress);
      
      const remainingSeconds = Math.max(0, estimatedSeconds - elapsed);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = Math.floor(remainingSeconds % 60);
      setEstimatedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      
      if (progress < 95) {
        setTimeout(updateProgress, 500);
      } else {
        // Complete export
        setTimeout(() => {
          setExportProgress(100);
          setIsExporting(false);
          alert(`Video exported successfully!\n\nFile: ${outputFileName}.${format}\nQuality: ${quality}\nResolution: ${customWidth}x${customHeight}`);
          onClose();
        }, 1000);
      }
    };
    
    updateProgress();
  };
  
  const handleCancelExport = () => {
    setIsExporting(false);
    setExportProgress(0);
  };
  
  const currentPreset = qualityPresets.find(p => p.value === quality);
  const estimatedFileSize = Math.round((bitrate * 1000 * (videoClips.reduce((total, clip) => total + clip.duration, 0) || 60)) / (8 * 1024 * 1024));
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoFile />
          Export Video
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Basic Settings */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Basic Settings</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Output Filename"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                fullWidth
                helperText="Name of the exported file"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  label="Output Format"
                >
                  {videoFormats.map((f) => (
                    <MenuItem key={f.value} value={f.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{f.icon}</span>
                        <Box>
                          <Typography variant="body2">{f.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {f.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Quality & Resolution */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Quality & Resolution</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Quality Preset</InputLabel>
                <Select
                  value={quality}
                  onChange={(e) => handleQualityChange(e.target.value)}
                  label="Quality Preset"
                >
                  {qualityPresets.map((q) => (
                    <MenuItem key={q.value} value={q.value}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="body2">{q.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {q.resolution}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Resolution</InputLabel>
                <Select
                  value={resolution}
                  onChange={(e) => handleResolutionChange(e.target.value)}
                  label="Resolution"
                >
                  <MenuItem value="720p">720p (HD)</MenuItem>
                  <MenuItem value="1080p">1080p (Full HD)</MenuItem>
                  <MenuItem value="1440p">1440p (2K)</MenuItem>
                  <MenuItem value="4k">4K (Ultra HD)</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {resolution === 'custom' && (
              <>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Frame Rate</InputLabel>
                <Select
                  value={fps}
                  onChange={(e) => setFps(e.target.value as any)}
                  label="Frame Rate"
                >
                  {frameRates.map((f) => (
                    <MenuItem key={f.value} value={f.value}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="body2">{f.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {f.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Advanced Settings */}
        <Box sx={{ mb: 4 }}>
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="text"
            sx={{ mb: 2 }}
          >
            {showAdvanced ? '▼' : '▶'} Advanced Settings
          </Button>
          
          {showAdvanced && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  Video Bitrate: {bitrate} kbps
                </Typography>
                <Slider
                  value={bitrate}
                  onChange={(_, value) => setBitrate(value as number)}
                  min={512}
                  max={50000}
                  step={100}
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  Audio Bitrate: {audioBitrate} kbps
                </Typography>
                <Slider
                  value={audioBitrate}
                  onChange={(_, value) => setAudioBitrate(value as number)}
                  min={64}
                  max={320}
                  step={16}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Export Preview */}
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: 2, 
          p: 3,
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="subtitle1" gutterBottom>Export Preview</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Hd />
                <Box>
                  <Typography variant="body2">Resolution</Typography>
                  <Typography variant="h6">
                    {customWidth} x {customHeight}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Memory />
                <Box>
                  <Typography variant="body2">Estimated Size</Typography>
                  <Typography variant="h6">
                    {isExporting ? 'Calculating...' : `${estimatedFileSize} MB`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Speed />
                <Box>
                  <Typography variant="body2">Frame Rate</Typography>
                  <Typography variant="h6">{fps} fps</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Settings />
                <Box>
                  <Typography variant="body2">Quality</Typography>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {quality}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Format: {format.toUpperCase()} • Video: {bitrate} kbps • Audio: {audioBitrate} kbps
            </Typography>
          </Box>
        </Box>

        {/* Export Progress */}
        {isExporting && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Exporting your video... This may take several minutes depending on the length and quality.
            </Alert>
            
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Exporting...</Typography>
                <Typography variant="body2">
                  {exportProgress}% • ETA: {estimatedTime}
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={exportProgress} />
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              Processing video and audio tracks, applying subtitles and effects...
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isExporting}
          variant="outlined"
        >
          Cancel
        </Button>
        
        {!isExporting ? (
          <Button 
            onClick={handleExport}
            variant="contained"
            disabled={!outputFileName || videoClips.length === 0}
            startIcon={<VideoFile />}
          >
            Start Export
          </Button>
        ) : (
          <Button 
            onClick={handleCancelExport}
            variant="contained"
            color="error"
          >
            Cancel Export
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;