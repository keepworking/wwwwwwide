
const jimp = require('jimp')


self.addEventListener("message", function(e) {
    targetPath = e.data['targetPath']
    size = e.data['size']
    console.log(e.data)

    jimp.read(targetPath).then(function (target) {
      var baseImage = new jimp(size.width,size.height,0xFFFFFFFF)
      var backImg = target.clone();
      var frontImg = target.clone();
      backImg.resize(size.width,jimp.AUTO,jimp.RESIZE_BICUBIC)
      frontImg.resize(jimp.AUTO,size.height,jimp.RESIZE_BICUBIC)
      baseImage.composite(backImg,0,(size.height  - backImg.bitmap.height)/2)
      baseImage.blur(10)
      baseImage.composite(frontImg,(size.width -frontImg.bitmap.width)/2,0)
      baseImage.quality(100).write(targetPath)
      target = null;
      backImg = null;
      frontImg = null;
      backImg = null;
      self.postMessage('finish');
    }).catch(function (err) {
      console.log(err)
      self.postMessage('error');
    });
    return;
});
