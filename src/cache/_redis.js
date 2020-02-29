/**
 * @description 连接redis的方法 set get
 */

 const redis = require('redis')
 const { REDIS_CONF } = require('../conf/db')

//  创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
  console.error('redis error:', err)
})

/**
 * redis set
 * @param {string} key 键
 * @param {string} val 值
 * @param {Number} timeout 过期时间 s
 */
function set(key, val, timeout = 60 * 60) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val)
  redisClient.expire(key, timeout)
}