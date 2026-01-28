import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addVideoClip, clearSubtitles } from '../store/editorStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
  AlertTitle,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  UploadFile,
  VideoLibrary,
  CheckCircle,
} from '@mui/icons-material';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
}

interface VideoMetadata {
  name: string;
  size: number;
  type: string;
  duration: number;
  width: number;
  height: number;
  codec: string;
  thumbnail: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const acceptedFormats = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'];
  const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size exceeds maximum limit of ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Simulate metadata extraction
    simulateMetadataExtraction(file);
  };

  const simulateMetadataExtraction = (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate processing steps
    const steps = [
      { progress: 10, message: 'Validating file...' },
      { progress: 20, message: 'Extracting video stream...' },
      { progress: 40, message: 'Analyzing codec information...' },
      { progress: 60, message: 'Calculating duration...' },
      { progress: 80, message: 'Generating thumbnail...' },
      { progress: 100, message: 'Processing complete!' },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setUploadProgress(step.progress);
      }, index * 500);
    });

    // Simulate metadata after delay
    setTimeout(() => {
      const mockMetadata: VideoMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        duration: Math.random() * 300 + 60, // 1-6 minutes
        width: 1920,
        height: 1080,
        codec: 'H.264',
        thumbnail: generateMockThumbnail(),
      };
      
      setMetadata(mockMetadata);
      setIsProcessing(false);
    }, steps.length * 500);
  };

  const generateMockThumbnail = () => {
    // Generate SVG thumbnail with video icon
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjaA8L3RleHQ+PC9zdmc+`;
  };

  const handleUpload = () => {
    if (!selectedFile || !metadata) return;

    setIsProcessing(true);
    setUploadProgress(0);

    // Create video clip from metadata
    const videoClip = {
      name: metadata.name,
      url: previewUrl || '',
      startTime: 0,
      duration: metadata.duration,
      inPoint: 0,
      outPoint: metadata.duration,
      volume: 100,
      opacity: 100,
      speed: 1,
      width: metadata.width,
      height: metadata.height,
      codec: metadata.codec,
      thumbnail: generateMockThumbnail(),
    };

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = Math.min(100, prev + Math.random() * 20);
        if (next >= 100) {
          clearInterval(uploadInterval);
          // Add to Redux store
          dispatch(clearSubtitles());
          dispatch(addVideoClip(videoClip));
          setIsProcessing(false);
          
          setTimeout(() => {
            onClose();
            resetState();
          }, 500);
        }
        return next;
      });
    }, 200);
  };

  const resetState = () => {
    setSelectedFile(null);
    setMetadata(null);
    setUploadProgress(0);
    setIsProcessing(false);
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onClose={() => { onClose(); resetState(); }} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UploadFile />
          Upload Video File
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Upload Area */}
        {!selectedFile && (
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <VideoLibrary sx={{ fontSize: 48, color: '#666', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag and drop video file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
              Supported: MP4, MOV, AVI, WebM (Max: 2GB)
            </Typography>
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              Processing video...
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {uploadProgress}% Complete
            </Typography>
          </Box>
        )}

        {/* File Preview and Info */}
        {selectedFile && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {/* Preview */}
              <Grid item xs={12} md={4}>
                <Card>
                  {previewUrl ? (
                    <CardMedia
                      component="img"
                      height="150"
                      image={previewUrl}
                      alt="Video preview"
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        height: 150, 
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <VideoLibrary sx={{ fontSize: 48, color: '#999' }} />
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="subtitle2" noWrap>
                      {selectedFile.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Metadata */}
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" gutterBottom>Video Information</Typography>
                
                {metadata ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">File Size:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatFileSize(metadata.size)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Duration:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.floor(metadata.duration / 60)}:{Math.floor(metadata.duration % 60).toString().padStart(2, '0')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Resolution:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {metadata.width} x {metadata.height}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Codec:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {metadata.codec}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Format:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {metadata.type || 'video/mp4'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label="HD Quality" 
                        color="success" 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={metadata.codec} 
                        color="info" 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`${Math.round(metadata.size / (1024 * 1024))}MB`} 
                        color="default" 
                        size="small" 
                      />
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Extracting metadata...
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <AlertTitle>Automatic Features</AlertTitle>
              <Box component="ul" sx={{ mt: 0, mb: 0 }}>
                <li>Audio will be automatically extracted for speech recognition</li>
                <li>Quran verses will be matched using OpenAI Whisper</li>
                <li>Automatic subtitle generation with timestamps</li>
              </Box>
            </Alert>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={() => { onClose(); resetState(); }}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        
        {selectedFile && (
          <>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              variant="outlined"
            >
              Choose Different File
            </Button>
            
            <Button 
              onClick={handleUpload}
              disabled={!metadata || isProcessing}
              variant="contained"
              startIcon={metadata && <CheckCircle />}
            >
              {isProcessing ? `Processing... ${uploadProgress}%` : 'Upload & Process'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;