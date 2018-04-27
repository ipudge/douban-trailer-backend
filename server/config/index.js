const path = require('path')

module.exports = {
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    video: ''
  },
  tokenSecret: 'dota',
  list_movie_count: 20,
  xiongmaodaili: {
    orderno: 'DT20180411191402RgM6qGQK',
    secret: '029c31c4863bac2a450ade29017f94e3',
    proxy: 'http://dynamic.xiongmaodaili.com:8088'
  },
  getMovieTaskSchedule: '0 52 23 * * *',
  log_dir: path.join(__dirname, '../logs')
}
