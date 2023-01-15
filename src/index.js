const {app, BrowserWindow, protocol, dialog} = require("electron");
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: `build/_assets/electron-icon.png`,
    width: 900,
    height: 1000,
    show: false,
    webPreferences: {
      preload: path.join(process.resourcesPath, 'preload.js'),
    },
  });

  protocol.interceptFileProtocol('file', (request, callback) => {
    if (request.url.includes('/_canopy.js')) return callback({ path: app.getAppPath() + '/build/_canopy.js' });
    if (request.url.includes('/_canopy.js.map')) return callback({ path: app.getAppPath() + '/build/_canopy.js.map' });
    if (request.url.includes('/index.html')) return callback({ path: app.getAppPath() + '/build/index.html' });
    if (request.url.includes('/_data') || request.url.includes('/_assets')) {
      let segments = request.url.split('/');
      segments = segments.slice(3)
      let path = segments.join('/');
      path = app.getAppPath() + '/build/' + path;
      path = decodeURIComponent(path);
      return callback({path});
    }

    return callback({ path: app.getAppPath() + '/build/index.html' }); // redirect topic requests to index
  });

  mainWindow.webContents.setWindowOpenHandler(openHandler);

  function openHandler({ url }) {
    if (url.startsWith('file://')) {
      return { action: 'allow', outlivesOpener: true, overrideBrowserWindowOptions: { width: 900, height: 1000 } };
    } else {
      shell.openExternal(url);
      return { action: 'deny' };
    }
  }

  addNewWindowListeners(mainWindow);
  mainWindow.webContents.once('did-finish-load', function (){
    mainWindow.maximize();
    mainWindow.show();
  });
  mainWindow.webContents.on('did-create-window', newWindow =>
    newWindow.once('ready-to-show', () => addNewWindowListeners(newWindow))
  );


  function addNewWindowListeners(newWindow) {
    newWindow.webContents.on('did-create-window', evenNewerWindow =>
      evenNewerWindow.once('ready-to-show', () => evenNewerWindow.maximize())
    );

    newWindow.webContents.on('did-create-window', evenNewerWindow =>
      evenNewerWindow.once('ready-to-show', () => evenNewerWindow.webContents.setWindowOpenHandler(openHandler))
    )

    newWindow.webContents.on('did-create-window', evenNewerWindow =>
      evenNewerWindow.once('ready-to-show', () => addNewWindowListeners(evenNewerWindow))
    )
  }

  // and load the index.html of the app.

  await mainWindow.loadFile(`build/index.html`);
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
