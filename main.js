const electron = require('electron')
const jimp = require('jimp')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog


const path = require('path')
const url = require('url')

let mainWindow

function createWindow(){
  mainWindow = new BrowserWindow({width:1050,height: 450,frame: false})
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

ipc.on('convertfile',function (event,targetPath) {
  if(targetPath === null){
    return
  }
  targetPath = targetPath[0]
  jimp.read(targetPath).then(function (target) {
    // TODO: 이미지에 새로운 이미지를 그리는 함수 만들어야함 
    target.resize(256, 256)            // resize
    .quality(60)                 // set JPEG quality
    .greyscale()                 // set greyscale
    .write(targetPath); // save
  }).catch(function (err) {
    console.error(err);
  });
})
