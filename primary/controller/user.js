const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/crpy')

const login = (user, psw) => {
  const username = escape(user)
  psw = genPassword(psw)
  const password = escape(psw)
  const sql = `
    select username, realname from users where username=${username} and password=${password}
  `
  return exec(sql).then(rows => {
      return rows[0] || {}
  })
}

module.exports = {
  login
}