/* eslint-disable */
import path from 'path';
import ps from 'portscanner';
import { dialog, app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import shell from 'shelljs';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
ipcMain.on('pinger', () => {
  shell.exec(path.join(__dirname, '../scripts/waitSomeTime.sh'), () => {
    console.log('finished with the script');
  });
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: 'stuff and things',
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {

  })
  console.log('successfuly pinged');
});


ipcMain.on('getHealthStatus', (event) => {
  let servicesArray = ['management', 'au-telematics', 'auth', 'health', 'telematics', 'vehicle-enrollment'];
  // let servicesObject = {
  //   'management': 1,
  //   'au-telematics': 1,
  //   'auth': 1,
  //   'health': 1,
  //   'telematics': 1,
  //   'vehicle-enrollment': 1,
  // };

  let runningService = [];
  shell.config.execPath = '/usr/local/bin/node'; //shell.which('node');
  for (let service of servicesArray) {
    console.log(service);
    let exitCode = shell.exec(`~/workspace/fcs/${service}/launch.sh status`).code;
    if (exitCode === 0 ) {
      runningService.push(service);
    }
  }

  event.sender.send('getHealthStatusResponse', runningService);
});







ipcMain.on('allRunningServices', (event) => {
  Promise.all([
    ps.checkPortStatus(8085, '127.0.0.1'),
    ps.checkPortStatus(9080, '127.0.0.1'),
    ps.checkPortStatus(8081, '127.0.0.1')
  ]
  ).then((values) => {
    console.log('Returning running ports...');
    console.log(values);
    event.sender.send('allRunningServicesResponse', values);
  })
    .catch((e) => {
      console.log(e, 'catastrophic failure');
    })
});
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
