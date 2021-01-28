const router = require('koa-router')()

router.prefix('/user')

router.post('/login', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
