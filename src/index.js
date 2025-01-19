const { app, BrowserWindow, ipcMain, desktopCapturer, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Main window
let mainWindow;

// Create screenshot directory
let capturePath;

const getScreenshots = (directory) => {
  try {
    const files = fs.readdirSync(directory);

    const pngList = files
      .filter((file) => path.extname(file).toLowerCase() === '.png')
      .map((file) => ({
        name: path.parse(file).name,
        path: path.join(directory, file),
      }));
    return pngList;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // get rid of the top bar
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Minimum window size
  mainWindow.setMinimumSize(470, 350);

  // Open the app and get all the pngs into a list
  capturePath = path.join(app.getPath('pictures'), 'screenshot-notebook');

  if (!fs.existsSync(capturePath)) {
    fs.mkdirSync(capturePath);
  }

  const screenshotPaths = getScreenshots(capturePath);
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('files-list', screenshotPaths);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('capture-window', async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (!focusedWindow) {
    throw new Error('No focused window available.');
  }

  // Get the bounds of the current window
  const windowBounds = focusedWindow.getBounds();

  // Get the screen that the window is on
  const display = screen.getDisplayMatching(windowBounds);

  try {
    mainWindow.hide();

    await new Promise((resolve) => setTimeout(resolve, 200));

    const screenshotPath = path.join(capturePath, `screenshot-${Date.now()}.png`);

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: display.bounds.width, height: display.bounds.height },
    });


    // Find the source matching the display ID
    const source = sources.find((source) => source.display_id === display.id.toString());
    if (!source) {
      throw new Error('Could not find screen source for the app window.');
    }

    const image = Buffer.from(source.thumbnail.toPNG());
    fs.writeFileSync(screenshotPath, image);

    mainWindow.show();
    
    return screenshotPath;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw error;
  }
});
