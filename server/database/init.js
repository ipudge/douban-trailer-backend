const mongoose = require('mongoose')
const glob = require('glob')
let db = 'mongodb://ipudge:ipudge@101.200.34.86:29999/douban-trailer'
const logger = require('../common/logger')
const {resolve} = require('path')
let env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  db = 'mongodb://localhost/douban-trailer'
}

mongoose.Promise = global.Promise

export const initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

export const connect = () => {
  let maxConnectTimes = 0;
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++

      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('出错了')
      }
    })

    mongoose.connection.on('error', (err) => {
      maxConnectTimes++

      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('出错了')
      }
    })

    mongoose.connection.once('open', () => {
      logger.info('mongodb 启动成功')
      resolve()
    })
  })
}