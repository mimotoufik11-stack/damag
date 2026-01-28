import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateSubtitle } from '../store/editorStore';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  VolumeUp,
  GraphicEq,
  MusicNote,
  VoiceChat,
  Audiotrack,
  Equalizer,
  Speed,
  Wave,
} from '@mui/icons-material';

interface AudioMixerProps {
  subtitleId?: string;
}

const AudioMixer: React.FC<AudioMixerProps> = ({ subtitleId }) => {
  const dispatch = useDispatch();
  const subtitles = useSelector((state: RootState) => state.editor.subtitleTrack);
  
  const [masterVolume, setMasterVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(80);
  const [effectsVolume, setEffectsVolume] = useState(100);
  const [voiceVolume, setVoiceVolume] = useState(100);
  
  const [masterPan, setMasterPan] = useState(0);
  const [bassBoost, setBassBoost] = useState(0);
  const [trebleBoost, setTrebleBoost] = useState(0);
  
  const [reverbAmount, setReverbAmount] = useState(0);
  const [reverbType, setReverbType] = useState('hall');
  
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  
  const [normalizeAudio, setNormalizeAudio] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(false);
  const [compressAudio, setCompressAudio] = useState(false);
  
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handleApplyToSubtitles = () => {
    if (!subtitleId && subtitles.length === 0) return;
    
    subtitles.forEach(subtitle => {
      dispatch(updateSubtitle({
        id: subtitle.id,
        updates: {
          // Audio timing adjustments
          startTime: subtitle.startTime,
          endTime: subtitle.endTime,
        }
      }));
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Audiotrack />
        Audio Mixer
      </Typography>
      
      <Grid container spacing={3}>
        {/* Master Volume */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <VolumeUp fontSize="small" />
              Master Volume
            </Typography>
            <Slider
              value={masterVolume}
              onChange={(_, value) => setMasterVolume(value as number)}
              min={0}
              max={200}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption">{masterVolume}%</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <GraphicEq fontSize="small" />
              Pan (Left/Right)
            </Typography>
            <Slider
              value={masterPan}
              onChange={(_, value) => setMasterPan(value as number)}
              min={-100}
              max={100}
              valueLabelDisplay="auto"
              marks={[
                { value: -100, label: 'L' },
                { value: 0, label: 'C' },
                { value: 100, label: 'R' }
              ]}
            />
          </Box>
        </Grid>

        {/* Track Volumes */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Voice Track
            </Typography>
            <Slider
              value={voiceVolume}
              onChange={(_, value) => setVoiceVolume(value as number)}
              min={0}
              max={200}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption">{voiceVolume}%</Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Music Track
            </Typography>
            <Slider
              value={musicVolume}
              onChange={(_, value) => setMusicVolume(value as number)}
              min={0}
              max={200}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption">{musicVolume}%</Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Effects Track
            </Typography>
            <Slider
              value={effectsVolume}
              onChange={(_, value) => setEffectsVolume(value as number)}
              min={0}
              max={200}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption">{effectsVolume}%</Typography>
          </Box>
        </Grid>

        {/* EQ Controls */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Equalizer fontSize="small" />
              Bass Boost
            </Typography>
            <Slider
              value={bassBoost}
              onChange={(_, value) => setBassBoost(value as number)}
              min={-20}
              max={20}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Treble Boost
            </Typography>
            <Slider
              value={trebleBoost}
              onChange={(_, value) => setTrebleBoost(value as number)}
              min={-20}
              max={20}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>

        {/* Reverb Controls */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MusicNote fontSize="small" />
              Reverb Amount
            </Typography>
            <Slider
              value={reverbAmount}
              onChange={(_, value) => setReverbAmount(value as number)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <FormControl fullWidth size="small">
            <InputLabel>Reverb Type</InputLabel>
            <Select
              value={reverbType}
              onChange={(e) => setReverbType(e.target.value)}
              label="Reverb Type"
            >
              <MenuItem value="hall">Hall</MenuItem>
              <MenuItem value="church">Mosque/Church</MenuItem>
              <MenuItem value="room">Room</MenuItem>
              <MenuItem value="cathedral">Cathedral</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Fades */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Fade In (seconds)
            </Typography>
            <Slider
              value={fadeIn}
              onChange={(_, value) => setFadeIn(value as number)}
              min={0}
              max={5}
              step={0.5}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Fade Out (seconds)
            </Typography>
            <Slider
              value={fadeOut}
              onChange={(_, value) => setFadeOut(value as number)}
              min={0}
              max={5}
              step={0.5}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>

        {/* Processing Options */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>Processing</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={normalizeAudio}
                onChange={(e) => setNormalizeAudio(e.target.checked)}
              />
            }
            label="Normalize Audio"
          />
          <FormControlLabel
            control={
              <Switch
                checked={compressAudio}
                onChange={(e) => setCompressAudio(e.target.checked)}
              />
            }
            label="Compression"
          />
          <FormControlLabel
            control={
              <Switch
                checked={noiseReduction}
                onChange={(e) => setNoiseReduction(e.target.checked)}
              />
            }
            label="Noise Reduction"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Playback Speed
          </Typography>
          <Slider
            value={playbackSpeed}
            onChange={(_, value) => setPlaybackSpeed(value as number)}
            min={0.25}
            max={4}
            step={0.25}
            valueLabelDisplay="auto"
            marks={[
              { value: 0.25, label: '0.25x' },
              { value: 1, label: '1x' },
              { value: 4, label: '4x' }
            ]}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleApplyToSubtitles}
          disabled={subtitles.length === 0}
        >
          Apply to Subtitles
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setMasterVolume(100);
            setMusicVolume(80);
            setEffectsVolume(100);
            setVoiceVolume(100);
            setMasterPan(0);
            setBassBoost(0);
            setTrebleBoost(0);
            setReverbAmount(0);
            setFadeIn(0);
            setFadeOut(0);
            setNormalizeAudio(false);
            setNoiseReduction(false);
            setCompressAudio(false);
            setPlaybackSpeed(1);
          }}
        >
          Reset All
        </Button>
      </Box>
    </Paper>
  );
};

export default AudioMixer;