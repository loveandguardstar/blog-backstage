
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { get } = require('../db/redis')
const {
  getList,
  getDetail
} = require('../controller/blog')

const blogHandle = (req, res) => {
  const id = req.query.id

  if (req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const result = getList(author, keyword)
    return result.then(listData => {
        return new SuccessModel(listData)
    })
  }

  if (req.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(data => {
        return new SuccessModel(data)
    })
}
}

module.exports = blogHandle