require("babel-core/register")()
require('babel-polyfill')
const R = require('ramda')
const {resolve} = require('path')
const Koa = require('koa')
const app = new Koa()

// R.compose(
//   R.forEachObjIndexed(
//     initWith => initWith(app)
//   ),
//   require,
//   name => resolve(__dirname, `../server/middlewares/${name}`)
// )(['cors'])

console.log(require(resolve(__dirname, '../server/middlewares/cors.js')))

R.forEachObjIndexed(
  initWith => console.log(initWith(app))
)(require(resolve(__dirname, '../server/middlewares/cors.js')))