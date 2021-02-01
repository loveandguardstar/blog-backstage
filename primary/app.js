const querystring = require('querystring')
const blogHandle = require('./router/blog')
const userHandle = require('./router/user')

const serverHander = (req, res) => {
  // 设置返回格式
  res.setHeader('Content-type', 'application/json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析query
  req.query = querystring.parse(url.split('?')[1])

  const blogRouter = blogHandle(req, res)
  if (blogRouter) {
    blogRouter.then(blogData => {
      res.end(
        JSON.stringify(blogData)
      )
    })
  }

  const userRouter = userHandle(req, res)
  if (userRouter) {
    blogRouter.then(blogData => {
      res.end(
        JSON.stringify(blogData)
      )
    })
  }

}

module.exports = serverHander