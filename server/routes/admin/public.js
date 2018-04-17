const jwt = require('jsonwebtoken')
const Joi = require('joi')

const {
  controller,
  post,
  validateBody
} = require('../../lib/decorator')
const {
  checkPassword
} = require('../../service/user')
const config = require('../../config')


@controller('/admin/v0/public')
export class userController {
  @post('/login')
  @validateBody({
    email: Joi.string().email().error(new Error('请输入合法的邮箱')),
    password: Joi.any().required().error(new Error('密码不能为空'))
  })
  async login(ctx) {
    let {
      email,
      password
    } = ctx.request.body

    email = email.trim()
    password = password.trim()

    try {
      let match = await checkPassword(email, password)

      const user = match.user;

      if (user && user.isLocked) {
        ctx.body = {
          code: -1,
          msg: '账号已被锁'
        }
      } else {
        if (match.match) {
          let payload = {
            username: user.username,
            id: user._id
          }
          ctx.body = {
            code: 200,
            msg: '成功',
            data: {
              token: jwt.sign(payload, config.tokenSecret, {expiresIn: '2h'}),
              username: user.username
            }
          }
        } else {
          ctx.body = {
            code: -1,
            msg: '账号密码错误'
          }
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: e
      }
    }

  }
}