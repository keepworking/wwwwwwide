const electron = require("electron")
const jimp = require('jimp')
const path = require('path')
const ipc = electron.ipcRenderer
const Screen = electron.screen
const nativeImage = electron.nativeImage


const size = Screen.getPrimaryDisplay().size


const openBtn = document.getElementById('openfile')
const convertBtn = document.getElementById('convertfile')
const loading = document.getElementById('loading')
const imgView = document.getElementById('imgView')


loading.style['visibility'] = "hidden"

var targetPath = null;

openBtn.addEventListener('click',function () {
  ipc.send('openfile');
})

ipc.on('openedfile',function (event,path) {
  targetPath = path[0]
  jimp.read(targetPath).then(function(img){
    img.resize(jimp.AUTO,450).getBase64(jimp.AUTO,function(err,src){
      if(err){
        return
      }
      var preview = document.createElement("IMG");
      preview.src = src
      imgView.innerHTML = ''
      imgView.appendChild(preview)
    })
  })

})


convertBtn.addEventListener('click',function () {
  if(targetPath === null){
    return
  }
  loading.style['visibility'] = "visible"
  targetpath = targetPath

  var worker = new Worker("./worker.js")
  worker.onmessage = function(e){
    loading.style['visibility'] = "hidden"
    console.log(e.data)
    worker.terminate();
  }
  worker.postMessage({'targetPath':targetpath,'size':size});

})




ipc.on('converted',function (event) {
  loading.style['visibility'] = "hidden"
})
