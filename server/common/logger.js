const config = require('../config');
const pathLib = require('path')

const log4js = require('log4js');
log4js.configure({
  appenders: { cheese: { type: 'file', filename: pathLib.join(config.log_dir, 'cheese.log') } },
  categories: { default: { appenders: ['cheese'], level: 'info' } }
});

const logger = log4js.getLogger('cheese');

module.exports = logger;
