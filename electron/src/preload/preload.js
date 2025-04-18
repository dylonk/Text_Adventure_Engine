// Node.js modules

//preload.js essentilly functions as an API, giving our renderer specific, defined ways to interact with the main process.
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');


// Expose a limited API to renderer process (your UI)
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openGameFile: async () => {
    return await ipcRenderer.invoke('open-game-file');
  },
  
  saveGameFile: async (gameData) => {
    console.log("save game file called", gameData);
    return await ipcRenderer.invoke('save-game-file', gameData);
  },
  
  
  // Listen for events from the main process
  onLoadGameData: (callback) => {
    ipcRenderer.on('load-game-data', (event, data) => callback(data));
  },


  // this one sends a savegame signal to the renderer
  onMenuSaveGame: (callback) => {
    ipcRenderer.on('menu-save-game', () => callback());
  }
});
