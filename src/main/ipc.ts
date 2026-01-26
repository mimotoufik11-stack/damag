import { ipcMain, BrowserWindow } from 'electron';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Store for keeping track of response callbacks
const pendingRequests = new Map<string, {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}>();

let requestIdCounter = 0;

function generateRequestId(): string {
  return `req_${++requestIdCounter}_${Date.now()}`;
}

// IPC handler for API calls
ipcMain.handle('api:request', async (event, { method, endpoint, data, params }) => {
  const requestId = generateRequestId();
  const mainWindow = BrowserWindow.getAllWindows()[0];

  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      params,
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error('API Error:', error);
    return {
      success: false,
      error: (error as any).response?.data?.detail || (error as any).message || 'Unknown error',
    };
  }
});

// IPC handler for project operations
ipcMain.handle('project:open', async (_, projectPath: string) => {
  // Implementation for opening a project file
  return { success: true, projectPath };
});

ipcMain.handle('project:save', async (_, projectData: unknown) => {
  // Implementation for saving a project
  return { success: true };
});

// IPC handler for media operations
ipcMain.handle('media:import', async (_, filePath: string) => {
  // Implementation for importing media files
  return { success: true, filePath };
});

// IPC handler for export operations
ipcMain.handle('export:start', async (_, exportConfig: unknown) => {
  // Implementation for starting export
  return { success: true, jobId: 'export_001' };
});

// Progress updates
ipcMain.on('export:progress', (event, progress: number) => {
  // Broadcast progress to renderer
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('export:progress', progress);
  });
});

// Error notifications
ipcMain.on('error:notify', (event, error: Error) => {
  // Show error notification
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    mainWindow.webContents.send('notification:error', {
      message: error.message,
      stack: error.stack,
    });
  }
});

export function registerIpcHandlers(): void {
  console.log('IPC handlers registered');
}
