import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  play,
  pause,
  setCurrentTime,
} from '../store/editorStore';

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Divider,
  Drawer,
} from '@mui/material';

import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  FileUpload,
  Save,
  Settings,
  VideoLabelOutlined,
  SubtitlesOutlined,
} from '@mui/icons-material';

import VideoPreview from '../components/VideoPreview';
import Timeline from '../components/Timeline';
import FontManager from '../components/FontManager';
import TemplateSelector from '../components/TemplateSelector';
import AudioMixer from '../components/AudioMixer';
import ExportDialog from '../components/ExportDialog';
import ProjectManager from '../components/ProjectManager';
import ColorPanel from '../components/ColorPanel';
import UploadDialog from '../components/UploadDialog';

const theme = createTheme({
  direction: 'rtl',
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'p',
          body1: 'span',
        },
      },
    },
  },
});

const drawerWidth = 320;

const EditorPage: React.FC = () => {
  const dispatch = useDispatch();
  const { isPlaying, currentTime, duration, videoClips, subtitleTrack, effects } = useSelector(
    (state: RootState) => state.editor
  );

  const [tabValue, setTabValue] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showFontManager, setShowFontManager] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        dispatch(setCurrentTime(currentTime + 0.1));
        if (currentTime >= duration) {
          dispatch(setCurrentTime(0));
          dispatch(pause());
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, dispatch]);

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', direction: 'rtl' }}>
        <CssBaseline />
        
        {/* Top App Bar */}
        <AppBar position="absolute" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1e1e1e' }}>
          <Toolbar variant="dense">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {videoClips.length > 0 ? videoClips[0].name : 'No video uploaded'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit" onClick={() => setShowProjectManager(true)}>
                <FileUpload />
              </IconButton>
              <IconButton color="inherit" onClick={() => {}}>
                <Save />
              </IconButton>
              <IconButton color="inherit" onClick={() => setShowFontManager(true)}>
                <VideoLabelOutlined />
              </IconButton>
              <IconButton color="inherit" onClick={() => setShowTemplates(true)}>
                <SubtitlesOutlined />
              </IconButton>
              <IconButton color="inherit" onClick={() => setShowExport(true)}>
                <Settings />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Left Sidebar - Properties Panel */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', top: 64 },
          }}
        >
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Typography variant="h6" gutterBottom>الخصائص</Typography>
            
            {/* Video/Clips Tab */}
            {tabValue === 0 && (
              <div>
                <Typography variant="subtitle2" gutterBottom>الفيديو</Typography>
                {videoClips.map((clip) => (
                  <Box key={clip.id} sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="caption">{clip.name}</Typography>
                    <Typography variant="caption" display="block">
                      {clip.width}x{clip.height} • {Math.round(clip.duration)}s
                    </Typography>
                  </Box>
                ))}
              </div>
            )}

            {/* Subtitles Tab */}
            {tabValue === 1 && (
              <div>
                <Typography variant="subtitle2" gutterBottom>الترجمة</Typography>
                {subtitleTrack.map((subtitle) => (
                  <Box key={subtitle.id} sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="caption">{subtitle.arabicText || subtitle.text}</Typography>
                    <Typography variant="caption" display="block">
                      {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                    </Typography>
                  </Box>
                ))}
              </div>
            )}

            {/* Effects Tab */}
            {tabValue === 2 && (
              <div>
                <Typography variant="subtitle2" gutterBottom>التأثيرات</Typography>
                {effects.map((effect) => (
                  <Box key={effect.id} sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="caption">{effect.name}</Typography>
                    <Typography variant="caption" display="block">{effect.type}: {effect.value}</Typography>
                  </Box>
                ))}
              </div>
            )}

            <Divider sx={{ my: 2 }} />
            <ColorPanel />
          </Box>
        </Drawer>

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
          <Box sx={{ height: 'calc(100vh - 200px)' }}>
            <VideoPreview
              time={currentTime}
              videoClips={videoClips}
              subtitles={subtitleTrack.filter(
                s => s.startTime <= currentTime && s.endTime >= currentTime
              )}
              effects={effects.filter(e => e.enabled)}
              width={state.exportSettings.customWidth}
              height={state.exportSettings.customHeight}
              onTimeChange={setCurrentTime}
            />
          </Box>

          {/* Playback Controls */}
          <Box sx={{ height: 60, borderTop: '1px solid #ccc', display: 'flex', alignItems: 'center', px: 2, gap: 2, backgroundColor: '#fafafa' }}>
            <IconButton onClick={() => dispatch(setCurrentTime(0))}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handlePlayPause}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={() => dispatch(setCurrentTime(duration))}>
              <SkipNext />
            </IconButton>
            
            <Box sx={{ flexGrow: 1, mx: 2 }}>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={(e) => dispatch(setCurrentTime(parseFloat(e.target.value)))}
                style={{ width: '100%', height: 8 }}
              />
            </Box>
            
            <Typography variant="body2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>

          {/* Timeline */}
          <Box sx={{ height: 120, borderTop: '1px solid #ccc' }}>
            <Timeline
              time={currentTime}
              videoClips={videoClips}
              subtitles={subtitleTrack}
              effects={effects}
              onTimeChange={setCurrentTime}
              duration={duration}
            />
          </Box>
        </Box>

        {/* Right Sidebar - Tools */}
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', top: 64 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>الأدوات</Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <button
                onClick={() => setTabValue(0)}
                style={{
                  padding: '8px 12px',
                  background: tabValue === 0 ? '#1976d2' : 'transparent',
                  color: tabValue === 0 ? 'white' : 'black',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '4px'
                }}
              >
                Clip
              </button>
              <button
                onClick={() => setTabValue(1)}
                style={{
                  padding: '8px 12px',
                  background: tabValue === 1 ? '#1976d2' : 'transparent',
                  color: tabValue === 1 ? 'white' : 'black',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '4px'
                }}
              >
                Subtitle
              </button>
              <button
                onClick={() => setTabValue(2)}
                style={{
                  padding: '8px 12px',
                  background: tabValue === 2 ? '#1976d2' : 'transparent',
                  color: tabValue === 2 ? 'white' : 'black',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Effects
              </button>
            </Box>

            {/* Add Upload Button */}
            <button
              onClick={() => setShowUpload(true)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            >
              Upload Video
            </button>

            <AudioMixer />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>معلومات القرآن</Typography>
              <Typography variant="caption">Surah detected: {subtitleTrack.length > 0 ? subtitleTrack[0].surah : 'None'}</Typography>
              <Typography variant="caption" display="block">Ayah detected: {subtitleTrack.length > 0 ? subtitleTrack[0].ayah : 'None'}</Typography>
              <Typography variant="caption" display="block">Verses: {subtitleTrack.length}</Typography>
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Dialogs */}
      <UploadDialog open={showUpload} onClose={() => setShowUpload(false)} />
      <ExportDialog open={showExport} onClose={() => setShowExport(false)} />
      <ProjectManager open={showProjectManager} onClose={() => setShowProjectManager(false)} />
      <FontManager open={showFontManager} onClose={() => setShowFontManager(false)} />
      <TemplateSelector open={showTemplates} onClose={() => setShowTemplates(false)} />
    </ThemeProvider>
  );
};

export default EditorPage;
