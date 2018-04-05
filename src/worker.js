
const jimp = require('jimp')

var baseImage
var backImg
var frontImg

self.addEventListener("message", function(e) {
    targetPath = e.data['targetPath']
    size = e.data['size']
    console.log(e.data)

    jimp.read(targetPath).then(function (target) {
      backImg = target.clone();
      frontImg = target.clone();
      // RESIZE_NEAREST_NEIGHBOR so bad
      // RESIZE_BILINEAR 위보단 나음
      // RESIZE_BICUBIC bilinear 비슷
      // RESIZE_HERMITE 비슷
      // RESIZE_BEZIER 좀 나은것 같기도..
      backImg.resize(size.width,jimp.AUTO,jimp.RESIZE_BEZIER)
      frontImg.resize(jimp.AUTO,size.height,jimp.RESIZE_BEZIER)
      backImg.crop(0,(backImg.bitmap.height - size.height)/2,size.width,size.height)
      backImg.blur(10)
      backImg.composite(frontImg,(size.width -frontImg.bitmap.width)/2,0)
      backImg.quality(100).deflateStrategy(0).write(targetPath)
      target = null;
      backImg = null;
      frontImg = null;
      self.postMessage('finish');
      // close();
    }).catch(function (err) {
      console.log(err)
      self.postMessage('error');
    });
    return;
});
