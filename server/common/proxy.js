const crypto = require('crypto')
const url = require('url')
const https = require('https')
const HttpsProxyAgent = require('https-proxy-agent')

const config = require('../config')

const orderno = config.xiongmaodaili.orderno
const secret = config.xiongmaodaili.secret
const proxy = config.xiongmaodaili.proxy

const proxyFn = (endpoint) => {
  return new Promise((resolve, reject) => {
    let timestamp = parseInt(new Date().getTime()/1000)
    let txt = 'orderno='+orderno+',secret='+secret+',timestamp='+timestamp
    let md5 = crypto.createHash('md5')
    md5.update(txt)
    let sign = md5.digest('hex')
    sign = sign.toUpperCase()
    let options = url.parse(endpoint)

    options.headers = {
      'Proxy-Authorization':'sign='+sign+'&orderno='+orderno+"&timestamp="+timestamp
    }
    options.rejectUnauthorized = false

    let agent = new HttpsProxyAgent(proxy)
    options.agent = agent

    https.get(options, (res) =>  {
      let body = ''
      res.on('data',  (chunk) => {
        body += chunk
      })
      res.on('end',  () => {
        resolve(body)
      })
    });
  })
}


module.exports = proxyFn