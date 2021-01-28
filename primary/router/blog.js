
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
  getList
} = require('../controller/blog')

const blogHandle = (req, res) => {
  if (req.path === '/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const result = getList(author, keyword)
    return result.then(listData => {
        return new SuccessModel(listData)
    })
  }
}

module.exports = blogHandle