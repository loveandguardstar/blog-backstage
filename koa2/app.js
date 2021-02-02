const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const RedisStore = require('koa-redis')
const { REDIS_CONF } = require('./conf/db')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const user = require('./routes/user')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志
const ENV = process.env.NODE_ENV
if (ENV === 'dev') {
  // 开发 、 测试环境
  app.use(morgan('dev', {
    stream: process.stdout
  })); // 同 access.log
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  // 线上环境
  app.use(morgan('combined', {
    stream: writeStream
  })); // 同 access.log
}

// session 配置
app.keys = ['WJiol#23123_']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: RedisStore({
    // all: '127.0.0.1:6379'   // 写死本地的 redis
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
