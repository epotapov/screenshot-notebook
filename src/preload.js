const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    captureWindow: () => ipcRenderer.invoke('capture-window'),
});

