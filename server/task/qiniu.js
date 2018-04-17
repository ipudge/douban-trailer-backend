const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const accessKey = config.qiniu.accessKey
const secretKey = config.qiniu.secretKey

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const cfg = new qiniu.conf.Config()
cfg.zone = qiniu.zone.Zone_z2
const bucketManager = new qiniu.rs.BucketManager(mac, cfg)

let imgUrl = 'https://img3.doubanio.com/img/trailer/medium/2510331750.jpg'

const uploadToQiniu = (url, key) => {
	return new Promise((resolve, reject) => {
		bucketManager.fetch(url, bucket, key, function(err, respBody, respInfo) {
		  if (err) {
		    return reject(err);
		  } else {
		    if (respInfo.statusCode == 200) {
		      resolve({key})
		    } else {
		      reject(respInfo)
		    }
		  }
		});
	})
}

;(async () => {
	try {
		let imgData = await uploadToQiniu(imgUrl, nanoid() + '.jpg')
		console.log(imgData.key)
	} catch (e) {
		console.log(e)
	}
})()


