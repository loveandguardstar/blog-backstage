const router = require('koa-router')()
const {
  getList
} = require('../controller/index')
// 增加所有前置
router.prefix('/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author
  let keyword = ctx.query.keyword
  ctx.body = await getList(author, keyword)
})

module.exports = router