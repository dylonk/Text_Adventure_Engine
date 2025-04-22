//this is the entry point of the electron app, essentially a modified version of game.vue optimized to work online.

// Electron imports
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const AdmZip = require('adm-zip');
const os = require('os');
const { v4: uuidv4 } = require('uuid'); // for temp folder names
const path = require('path');
const fs = require('fs');


const isDev = !app.isPackaged;
//users also get a log file in their appdata.
const logFile = path.join(app.getPath('userData'), 'log.txt');
// Path to the savegames folder
const saveGamesFolder = path.join(app.getPath('userData'), 'savegames');


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
      { name: 'Game Files', extensions: ['zip'] }
    ],
    properties: ['openFile']
  });
  
  if (!canceled && filePaths.length > 0) {
    const zipPath = filePaths[0];
    const tempDir= path.join(os.tmpdir(), `text-adventure-${uuidv4()}`);  
    fs.mkdirSync(tempDir);
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);
    //find the game.json in the zip, it becomes gameData
    const gameJsonPath = path.join(tempDir, 'game.json');
    const gameData = JSON.parse(fs.readFileSync(gameJsonPath, 'utf8'));
    
    //look for a savegame for this game
    const saveFilePath=await checkForSaveGame(gameData.title);
    log("save file path"+ saveFilePath);

    //if there is a savegame, load it. In the future we can work with using multiple savegames. It won't be hard to rework, it already saves them all.
    if (saveFilePath) {
      try {
        let saveData = fs.readFileSync(saveFilePath, 'utf-8');
        gameData = JSON.parse(saveData);
        log(`Loaded savegame: ${JSON.stringify(gameData).slice(0, 200)}...`);
      } catch (e) {
        log(`❌ Failed to load save file: ${e.stack || e}`);
      }
    }

    // Process image map to use full paths
    if (gameData.images) {
      for (const key in gameData.images) {
        const imagePath = gameData.images[key];
        if (typeof imagePath === 'string' && imagePath.startsWith('assets/images/')) {
          gameData.images[key] = path.join(tempDir, imagePath);
        }
      }
    }    
    
    mainWindow.webContents.send('load-game-data', gameData);

    
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


// this listens for the event from the renderer process, because thats where all the data we need is. 
ipcMain.handle('save-game-file', async (event, gameData) => {
  log("save game file called"+ gameData);
  //get the title first so it knows where to put it
  const gameDataParsed = JSON.parse(gameData);
  const gameTitle = gameDataParsed.title;
  try
  {
    const savePath=path.join(saveGamesFolder, gameTitle);
  
  
    if(!fs.existsSync(savePath) )
    {
      fs.mkdirSync(savePath,{recursive:true});
    }

    const saveFilePath = path.join(savePath, 'save.json');
    log("save file path"+ saveFilePath);
    fs.writeFileSync(saveFilePath, gameData);
    return true;

  }
  catch(e)
  {
    log(e);
    return false;
  }
});


//better seperation of concerns having this function declaration here instead of in openGameDialog
async function checkForSaveGame(gameTitle) {
  log("check for save game called"+ gameTitle);
  const savePath = path.join(saveGamesFolder, gameTitle, 'save.json');
  log("save file path"+ savePath);
  return fs.existsSync(savePath) ? savePath : null;
}

// Access to game engine file
ipcMain.handle('load-game-engine', async () => {
  // Path to your game_logic.js in the frontend directory
  const enginePath = path.join(__dirname, '..', '..', 'frontend', 'src', 'utils', 'game_logic.js');
  return fs.readFileSync(enginePath, 'utf8');
});