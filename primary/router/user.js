const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
  login
} = require('../controller/user.js')

const userHandle = (req, res) => {
  if (req.method === 'POST' && req.path === '/api/user/login') {
    const username = req.query.username
    const password = req.query.password
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // 设置 session
        // req.session.username = data.username
        // req.session.realname = data.realname
        // // 同步到 redis
        // set(req.sessionId, req.session)

        return new SuccessModel()
    }
    return new ErrorModel('登录失败')
    })
  }
}

module.exports = userHandle

