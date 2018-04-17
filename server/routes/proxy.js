const urllib = require('url');
const rp = require('request-promise-native')
const _ = require('lodash')
const {
  controller,
  get
} = require('../lib/decorator')

const ALLOW_HOSTNAME = [
  'img3.doubanio.com',
  'img1.doubanio.com',
  'vt1.doubanio.com'
];

@controller('/agent')
export class proxyController {
  @get('/')
  async agent(ctx) {
    let url = decodeURIComponent(ctx.query.url);
    let hostname = urllib.parse(url).hostname;

    if (ALLOW_HOSTNAME.indexOf(hostname) === -1) {
      return ctx.body = hostname + ' is not allowed';
    }
    try {
      const res = rp({
        url: url,
        headers: _.omit(ctx.headers, ['cookie', 'referer', 'host']),
      })
      ctx.body = res
    } catch (e) {
      console.log(e)
    }
  }
}