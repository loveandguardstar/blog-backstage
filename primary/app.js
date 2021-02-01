const querystring = require('querystring')
const blogHandle = require('./router/blog')
const userHandle = require('./router/user')
const { get, set } = require('./db/redis')

// const SESSION_DATA = {}
// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log('d.toGMTString() is'+ d.toGMTString())
  return d.toGMTString()
}

const handlePostData = (req, res) => {
  const method = req.method
  const promise = new Promise((resolve, reject) => {
    if (method !== 'POST') {
      resolve({})
      return
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
  return promise
}

const serverHander = (req, res) => {
  // 设置返回格式
  res.setHeader('Content-type', 'application/json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析query
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0]
    const val = arr[1]
    req.cookie[key] = val
  });

  // 解析 session
  // let needSetCookie = false
  // let userId = req.cookie.userId
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  // 解析 session （redis）
  let needSetCookie = false
  let userId = req.cookie.userId
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userId, {})
  }

  req.sessionId = userId

  get(req.sessionId).then(sessionData => {
    if (!sessionData) {
      set(req.sessionId, {})
      req.session = {}
    } else {
      req.session = sessionData
    }

    // 处理 postData
    return handlePostData(req, res)
  }).then(postData => {
    req.body = postData
    const blogRouter = blogHandle(req, res)
    if (blogRouter) {
      blogRouter.then(blogData => {
        if (needSetCookie) {
          // 操作 cookie
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`) // 根路由，避免只在某个路由生效
        }
        res.end(
          JSON.stringify(blogData)
        )
      })
    }
  
    const userRouter = userHandle(req, res)
    if (userRouter) {
      userRouter.then(userData => {
        if (needSetCookie) {
          // 操作 cookie
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`) // 根路由，避免只在某个路由生效
        }
        res.end(
          JSON.stringify(userData)
        )
      })
    }
  })


}

module.exports = serverHander