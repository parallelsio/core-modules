import { app, BrowserWindow, Menu, shell } from 'electron';
import { writeFile, stat } from 'fs';
import { join, resolve } from 'path';

let mainWindow = null;

var installHost = function (cb) {
  var hostFile = join('Users', 'balcarce', 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts', 'com.makeparallels.clipper.json');

  stat(hostFile, function (error, stat) {
    if (!error)
      return;

    var strJson = JSON.stringify({
      "name": "com.makeparallels.clipper",
      "description": "Tag + save any tab's content to your parallels server",
      "path": resolve(__dirname, '..', '..', 'my_host.js'),
      "type": "stdio",
      "allowed_origins": [
        "chrome-extension://hgfhcghaemofhnndlihiloaobeokiegj/"
      ]
    }, null, 2);
    writeFile(hostFile, strJson, 'utf8', function (err) {
      if (err)
        throw err;
      cb();
    });
  });
};

// Emitted when the application is activated while there is no opened windows.
// It usually happens when a user has closed all of application's windows and then
// click on the application's dock icon.
app.on('activate-with-no-open-windows', function () {
  if (mainWindow) {
    mainWindow.show();
  }

  return false;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Emitted when Electron has done all of the initialization.
app.on('ready', function () {
  installHost(function (err) {
    if (err) {
      app.quit();
    }
    else {
      mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728
      });

      mainWindow.loadURL(`file://${__dirname}/app.html`);

      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
      });

      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
  });
});
