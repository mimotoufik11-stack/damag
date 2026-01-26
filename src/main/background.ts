import { app } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';

let backendProcess: ChildProcess | null = null;

export function setupBackgroundProcesses(): void {
  // Handle app lifecycle for background processes
  app.on('before-quit', cleanup);
  app.on('will-quit', (e) => {
    if (backendProcess) {
      e.preventDefault();
      cleanup();
    }
  });
}

export function startBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (backendProcess) {
      resolve();
      return;
    }

    const backendPath = path.join(__dirname, '../../backend');
    const pythonPath = process.platform === 'win32' ? 'python' : 'python3';

    // Check if backend directory exists
    if (!fs.existsSync(backendPath)) {
      console.warn('Backend directory not found, skipping backend startup');
      resolve();
      return;
    }

    backendProcess = spawn(pythonPath, ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
      cwd: backendPath,
      detached: true,
      stdio: 'pipe',
    });

    backendProcess.stdout?.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });

    backendProcess.stderr?.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('exit', (code) => {
      console.log(`Backend process exited with code ${code}`);
      backendProcess = null;
    });

    // Wait a bit for backend to start
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

export function stopBackend(): void {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

function cleanup(): void {
  stopBackend();
}

export function ensureBackendRunning(): void {
  if (!backendProcess) {
    startBackend().catch(console.error);
  }
}
