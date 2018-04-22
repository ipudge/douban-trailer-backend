const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const koaJwt = require('koa-jwt')
const router = require('./middlewares/router').router
const scheduleJob = require('./common/schedule')
const config = require('./config')

const {
  connect,
  initSchemas
} = require('./database/init.js')

;(async () => {

  try {
    await connect()

    initSchemas()

    app
      .use((ctx, next) => {
        return next().catch((err) => {
          if (401 == err.status) {
            ctx.body = {
              code: 401,
              msg: 'login again'
            }
          } else {
            throw err
          }
        })
      })
      .use(cors({
        origin (ctx) {
          if (['http://localhost:8080', 'http://movie-admin.ipudge.cn'].indexOf(ctx.headers.origin) > -1) {
            return ctx.headers.origin
          }
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
      }))
      .use(koaJwt({ secret: config.tokenSecret }).unless({ path: [/^\/admin\/v0\/public/, /^\/agent/, /^\/api\/*/] }))
      .use(bodyParser())

    router(app)
  } catch (e) {
    console.log(e)
  }

  app.listen(3000, () => {
    const {
      movieTask
    } = require('./task/schedule/movie.js')

    // scheduleJob(config.getMovieTaskSchedule, movieTask)

    // movieTask()
  })

})()
