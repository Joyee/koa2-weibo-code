/**
 * @description 微博缓存层
 */

const { get, set } = require('./_redis')
const { getBlogListByUser } = require('../services/blog')

// redis key 前缀
const KEY_PRIFIX = 'weibo:square'

/**
 *  获取广场列表的缓存
 * @param {Number} pageIndex 
 * @param {number} pageSize 
 */
async function getSquareCacheList(pageIndex, pageSize) {
  const key = `${KEY_PRIFIX}${pageIndex}_${pageSize}`
  // 尝试获取缓存
  const cacheResult = await get(key)
  if (cacheResult !== null) {
    // 缓存成功
    return cacheResult
  }

  // 缓存失败 读取数据库
  const result = await getBlogListByUser({ pageIndex, pageSize })

  // 设置缓存
  set(key, result, 60)

  return result
}

module.exports = {
  getSquareCacheList,
}