//this is the entry point of the electron app, essentially a modified version of game.vue optimized to work online.

// Electron imports
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;
const logFile = path.join(__dirname, 'log.txt');

//start logging!
function log(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
}
module.exports = log;

// Track main application window
let mainWindow;


app.whenReady().then(() => {
    autoUpdater.checkForUpdatesAndNotify();
  });




  
// Create the main application window
function createWindow() {


  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Text Adventure Launcher',
    webPreferences: {
      preload: path.join(__dirname,'..','preload', 'preload.js'),
      contextIsolation: true,  // Security: Isolates renderer from Node
      nodeIntegration: false,   // Security: Prevents direct Node access
      sandbox: false,
    }
  });

  // Load the launcher HTML
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools(); // optional
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist', 'index.html'));
}  
  // Create application menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Game',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            openGameDialog();
          }
        },
        {
          label: 'Save Game',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            mainWindow.webContents.send('menu-save-game');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: 'About Text Adventure Launcher',
              message: 'Text Adventure Launcher v1.0.0',
              detail: 'Created by Your Name\nPowered by Electron'
            });
          }
        }
      ]
    }
  ]);
  
  Menu.setApplicationMenu(menu);
  
  // Window management
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Open file dialog for game selection
async function openGameDialog() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Game File',
    filters: [
      { name: 'Game Files', extensions: ['game.json'] }
    ],
    properties: ['openFile']
  });
  
  if (!canceled && filePaths.length > 0) {
    const gameData = fs.readFileSync(filePaths[0], 'utf8');
    const gameDataJson = JSON.parse(gameData);
    mainWindow.webContents.send('load-game-data', gameDataJson);
  }
}

// App lifecycle events
app.whenReady().then(() => {
  createWindow();
  
  // macOS-specific behavior
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC event handling
ipcMain.handle('open-game-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    filters: [{ name: 'Game Files', extensions: ['game.json'] }],
    properties: ['openFile']
  });
  
  if (!canceled && filePaths.length > 0) {
    return fs.readFileSync(filePaths[0], 'utf8');
  }
  return null;
});

ipcMain.handle('save-game-file', async (event, gameData) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'Game Files', extensions: ['game.json'] }],
    properties: ['showOverwriteConfirmation']
  });
  
  if (!canceled && filePath) {
    fs.writeFileSync(filePath, gameData);
    return true;
  }
  return false;
});

// Access to game engine file
ipcMain.handle('load-game-engine', async () => {
  // Path to your game_logic.js in the frontend directory
  const enginePath = path.join(__dirname, '..', '..', 'frontend', 'src', 'utils', 'game_logic.js');
  return fs.readFileSync(enginePath, 'utf8');
});