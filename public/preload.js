const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Dialog methods
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Database methods
  dbQuery: (query, params) => ipcRenderer.invoke('db-query', query, params),
  
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (data, filePath) => ipcRenderer.invoke('save-file', data, filePath),
  
  // Platform info
  platform: process.platform,
  
  // Environment
  isElectron: true
});

// Add console logging for debugging
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron preload script loaded');
});