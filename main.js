const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog


const path = require('path')
const url = require('url')

let mainWindow

function createWindow(){
  mainWindow = new BrowserWindow({
    width:1050,
    height: 450,
    frame: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      webSecurity:false
    },
  })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol:'file:',
    slashes:true
  }))

  mainWindow.on('closed',function() {
    mainWindow = null
  })
}


app.on('ready',createWindow)

app.on('window-all-closed',function () {
  if(process.platform !== 'darwin'){
    app.quit()
  }
})

app.on('activate',function() {
  if(mainWindow === null){
    createWindow()
  }
})

ipc.on('openfile', function (event) {
  dialog.showOpenDialog({
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
    ],
    properties: ['openFile']
  }, function (files) {
    if (files) event.sender.send('openedfile', files)
  })
})
