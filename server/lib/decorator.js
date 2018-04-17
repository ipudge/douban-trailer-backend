const Router = require('koa-router')
const {resolve} = require('path')
const glob = require('glob')

const routerMap = new Map()
const symbolPrefix = Symbol('prefixPath')
const Joi = require('joi')

const toArray = obj => Array.isArray(obj) ? obj : [obj]

export class Route {
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }

  init() {
    glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require)

    for (let [conf, controller] of routerMap) {
      const controllers = toArray(controller)
      let prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path

      this.router[conf.method](routerPath, ...controllers)

      this.app.use(this.router.routes())
      this.app.use(this.router.allowedMethods())
    }
  }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)

  routerMap.set({
    target,
    ...conf
  }, target[key])
}

export const controller = path => (target) => (target.prototype[symbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'del',
  path: path
})

export const use = path => router({
  method: 'use',
  path: path
})

export const all = path => router({
  method: 'all',
  path: path
})

const innerValidate = function (obj, rule) {
  return new Promise((resolve, reject) => {
    let validateObj = {}
    for (let key of Object.keys(rule)) {
      let value = obj[key]
      if (value) {
        validateObj[key] = value
      }
    }
    let schema = Joi.object().keys(rule)
    let result = Joi.validate(validateObj, schema)
    if (result.error) {
      reject(result.error)
    } else {
      resolve()
    }
  })
}

export const validateBody = rule =>  {
  return (target, key, descriptor) => {
    target[key] = toArray(target[key])
    target[key].splice(target[key].length - 1, 0, validate)
  }

  async function validate (ctx, next) {
    try {
      await innerValidate(ctx.request.body, rule)
      await next()
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e.message
      }
    }
  }
}

export const validateQuery = rule => {
  return (target, key, descriptor) => {
    target[key] = toArray(target[key])
    target[key].splice(target[key].length - 1, 0, validate)
  }

  async function validate (ctx, next) {
    try {
      await innerValidate(ctx.query, rule)
      await next()
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e.message
      }
    }
  }
}


