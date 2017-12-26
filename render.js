const electron = require("electron")
const ipc = electron.ipcRenderer
const Screen = electron.screen
const size = Screen.getPrimaryDisplay().size


const openBtn = document.getElementById('openfile')
const convertBtn = document.getElementById('convertfile')

var targetPath = null;

openBtn.addEventListener('click',function () {
  ipc.send('openfile');
})

ipc.on('openedfile',function (event,path) {
  targetPath = path
})


convertBtn.addEventListener('click',function () {
  ipc.send('convertfile',targetPath);
})

ipc.on('converted',function (event,path) {
  targetPath = path
})
