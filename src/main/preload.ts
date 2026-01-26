import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  // Dialog operations
  dialog: {
    openFile: (options: any) => ipcRenderer.invoke('dialog:openFile', options),
    saveFile: (options: any) => ipcRenderer.invoke('dialog:saveFile', options),
    openDirectory: (options: any) => ipcRenderer.invoke('dialog:openDirectory', options),
  },
  // File system operations
  fs: {
    readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath: string, data: string) => ipcRenderer.invoke('fs:writeFile', filePath, data),
    exists: (filePath: string) => ipcRenderer.invoke('fs:exists', filePath),
    mkdir: (dirPath: string) => ipcRenderer.invoke('fs:mkdir', dirPath),
  },
  // App operations
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
    quit: () => ipcRenderer.invoke('app:quit'),
  },
  // IPC communication for custom handlers
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  removeListener: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback as any);
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
