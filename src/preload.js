const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    captureWindow: () => ipcRenderer.invoke('capture-window'),
    filesList: (callback) => ipcRenderer.on('files-list', (event, files) => callback(files)),
    deleteScreenshot: (file) => ipcRenderer.invoke('delete-screenshot', file),
    copyScreenshot: (file) => ipcRenderer.invoke('copy-screenshot', file),
});

