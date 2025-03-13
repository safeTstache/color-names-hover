
const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const robot = require('robotjs');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false, // Don't show the window by default
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:8080' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Register the global shortcut for Control+Shift+C
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    // Get mouse position
    const mouse = robot.getMousePos();
    
    // Get pixel color at mouse position
    const pixelColor = robot.getPixelColor(mouse.x, mouse.y);
    
    // Convert the hex string to RGB values
    const r = parseInt(pixelColor.substring(0, 2), 16);
    const g = parseInt(pixelColor.substring(2, 4), 16);
    const b = parseInt(pixelColor.substring(4, 6), 16);
    
    // Send the color data to the renderer process
    if (mainWindow) {
      mainWindow.webContents.send('color-picked', { r, g, b, x: mouse.x, y: mouse.y });
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Create tray icon
  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show App', 
      click: () => { 
        mainWindow.show(); 
        mainWindow.focus(); 
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => { 
        app.quit(); 
      } 
    }
  ]);
  tray.setToolTip('Color Picker');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Unregister all shortcuts when app is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
