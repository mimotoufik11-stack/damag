export interface ElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  send: (channel: string, ...args: any[]) => void;
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
  dialog: {
    saveFile: (options: any) => Promise<any>;
    openFile: (options: any) => Promise<any>;
    openDirectory: (options: any) => Promise<any>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
