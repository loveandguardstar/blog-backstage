const { exec } = require('../db/mysql')

const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1`
  if (author) {
    sql += `author = ${author}`
  }
  if (keyword) {
    sql += `keyword = ${keyword}`
  }
  return await exec(sql)
}

module.exports = {
  getList
}