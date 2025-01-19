const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    captureWindow: () => ipcRenderer.invoke('capture-window'),
    filesList: (callback) => ipcRenderer.on('files-list', (event, files) => callback(files)),
});

