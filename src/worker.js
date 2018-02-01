
const jimp = require('jimp')

var baseImage
var backImg
var frontImg

self.addEventListener("message", function(e) {
    targetPath = e.data['targetPath']
    size = e.data['size']
    console.log(e.data)

    jimp.read(targetPath).then(function (target) {
      baseImage = new jimp(size.width,size.height,0xFFFFFFFF)
      backImg = target.clone();
      frontImg = target.clone();
      // RESIZE_NEAREST_NEIGHBOR so bad
      // RESIZE_BILINEAR 위보단 나음
      // RESIZE_BICUBIC bilinear 비슷
      // RESIZE_HERMITE 비슷
      // RESIZE_BEZIER 좀 나은것 같기도..
      backImg.resize(size.width,jimp.AUTO,jimp.RESIZE_BICUBIC)
      frontImg.resize(jimp.AUTO,size.height,jimp.RESIZE_BICUBIC)
      baseImage.composite(backImg,0,(size.height  - backImg.bitmap.height)/2)
      baseImage.blur(10)
      baseImage.composite(frontImg,(size.width -frontImg.bitmap.width)/2,0)
      baseImage.quality(100).deflateStrategy(0).write(targetPath)
      target = null;
      backImg = null;
      frontImg = null;
      backImg = null;
      self.postMessage('finish');
      // close();
    }).catch(function (err) {
      console.log(err)
      self.postMessage('error');
    });
    return;
});
