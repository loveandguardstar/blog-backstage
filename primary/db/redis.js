const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, `${REDIS_CONF.host}`)
redisClient.on('error', err => {
  console.error(err)
})

function set(key, val) {
  // 做兼容性处理
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      
      if(val == null) {
        resolve(null)
        return
      }

      try {
        resolve(
          JSON.parse(val)
        )
      } catch(ex) {
        resolve(ex)
      }
    
      // 退出
      // redisClient.quit()
    })
  })
  return promise
}

module.exports = {
  get,
  set
}