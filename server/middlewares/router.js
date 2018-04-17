const {resolve} = require('path')
const {Route} = require('../lib/decorator.js')

export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)

  router.init()
}  