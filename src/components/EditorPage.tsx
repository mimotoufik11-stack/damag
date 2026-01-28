import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppDispatch, 
  uploadVideo, 
  transcribeAudio, 
  matchVerses, 
  loadQuranDatabase,
  setProject,
  setPlaybackState,
  setError
} from '../store/editorStore';
import { useDropzone } from 'react-dropzone';
import Timeline from './Timeline';
import PropertiesPanel from './PropertiesPanel';
import VideoPreview from './VideoPreview';

const EditorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject, isLoading, isExporting, exportProgress, error } = useSelector((state: any) => state.editor);
  const [uploadedVideo, setUploadedVideo] = useState<any>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024 * 1024) {
        dispatch(setError('File too large (max 2GB)'));
        return;
      }

      try {
        // Upload video
        const videoData = await dispatch(uploadVideo(file)).unwrap();
        setUploadedVideo(videoData);

        // Create project
        const project: any = {
          id: videoData.id,
          name: file.name,
          videoPath: videoData.path,
          duration: videoData.metadata.duration,
          fps: videoData.metadata.fps,
          resolution: `${videoData.metadata.width}x${videoData.metadata.height}`,
          subtitles: [{
            id: 'subtitle-track-1',
            name: 'آيات قرآنية',
            enabled: true,
            visible: true,
            locked: false,
            subtitles: []
          }],
          effects: [
            { id: effect-brightness, type: 'brightness', enabled: false, value: 0 },
            { id: effect-contrast, type: 'contrast', enabled: false, value: 100 },
            { id: effect-saturation, type: 'saturation', enabled: false, value: 100 },
            { id: effect-blur, type: 'blur', enabled: false, value: 0 }
          ],
          timeline: {
            zoom: 1,
            playheadPosition: 0,
            tracks: []
          }
        };
        dispatch(setProject(project));

        // Extract audio and transcribe
        const audioPath = `/api/audio/extract?videoPath=${encodeURIComponent(videoData.path)}`;
        const transcription = await dispatch(transcribeAudio(audioPath)).unwrap();
        
        // Match with Quran verses
        const matchedVerses = await dispatch(matchVerses(transcription.segments)).unwrap();
        
        // Update project with matched verses
        const subtitlesWithVerses = matchedVerses.map((segment: any) => ({
          id: `sub-${segment.start}`,
          start: segment.start,
          end: segment.end,
          text: segment.text,
          verse: segment.verse,
          style: {
            font: 'Cairo',
            fontSize: 60,
            color: '#FFFFFF',
            backgroundColor: '#000000',
            opacity: 0.8,
            position: 'bottom',
            shadow: {
              color: '#000000',
              blur: 10,
              offsetX: 2,
              offsetY: 2
            },
            stroke: {
              color: '#000000',
              width: 3
            }
          }
        }));

        project.subtitles[0].subtitles = subtitlesWithVerses;
        dispatch(setProject(project));

      } catch (error: any) {
        dispatch(setError(error.message || 'Failed to process video'));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    // Load Quran database on mount
    dispatch(loadQuranDatabase());
  }, [dispatch]);

  const handlePlayPause = () => {
    if (currentProject) {
      const newState = isPlaying ? paused : playing;
      dispatch(setPlaybackState(newState));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900" dir="rtl">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4">
        <button 
          onClick={() => window.history.back()}
          className="text-white px-4 hover:text-blue-400"
        >
          ← ر;ج;䀉; 虆;
        </button>
        
        <h1 className="text-xl font-bold text-white">儐; ا;&#x644;&#x642;&#x631;&#x622;&#x646;</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePlayPause}
            disabled={!currentProject}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded text-white"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button 
            onClick={() => calculateExport()}
            disabled={!currentProject || isExporting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded text-white"
          >
            儐; 鍔;
            {isExporting && '...'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Properties */}
        <PropertiesPanel />

        {/* Center - Video Preview */}
        <div className="flex-1 flex flex-col">
          {currentProject ? (
            <>
              <VideoPreview />
              <Timeline />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div
                {...getRootProps()}
                className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl w-full mx-8 p-20 text-center cursor-pointer hover:border-green-500 transition-colors"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-2xl text-green-400">🔭 أ;䐉; 昷; 技;</p>
                ) : (
                  <>
                    <p className="text-2xl text-gray-300 mb-4">檐; 抩; 戛; 䎑; 斓; 䍠;</p>
                    <p className="text-lg text-gray-400">ٰ;
                      🏔️
                      悁;
                      褺;
                      时;
                      . MP4, MOV, AVI, WebM 挄;
                      斓;
                      2GB 至;
                      䒄;
                      䐈;
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
            <p className="font-bold">ⅅ;腋;愁;</p>
            <p>{error}</p>
            <button 
              onClick={() => dispatch(setError(null))}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
            >
            搉;ر;䀉;
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-gray-100 px-6 py-4 rounded-lg">
            <div className="text-gray-600 text-xl mb-2">嶚;褺; 鏥;褺; 鏥;...</div>
            <div className="w-64 bg-gray-300 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Export Progress Modal */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-gray-900 w-96">
            <h2 className="text-xl font-bold mb-4">脥;礲;薯;) 
            {exportProgress?.stage}</h2>
            {exportProgress && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-green-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress.progress}%` }}
                  />
                </div>
                <div className="text-sm space-y-1">
                  <p>️ 
                  {exportProgress.stage}</p>
                  <p className="text-gray-600">徚;褺; 鏥;褺;: {Math.floor(exportProgress.timeElapsed)}s</p>
                  <p className="text-gray-600">\u6e19;褺; 鏥;: {Math.floor(exportProgress.timeRemaining)}s</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;