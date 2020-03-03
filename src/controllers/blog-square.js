/**
 * @description 广场API
 */

const { getSquareCacheList } = require('../cache/blog')
const { PAGE_SIZE } = require('../conf/constant')
const { SuccessModel } = require('../model/ResModel')

async function getSquareBlogList(pageIndex = 0) {
  const result = await getSquareCacheList(pageIndex, PAGE_SIZE)
  const blogList = result.blogList

  return new SuccessModel({
    isEmpty: blogList.length === 0,
    blogList,
    count: result.count,
    pageIndex,
    pageSize: PAGE_SIZE,
  })
}

module.exports = {
  getSquareBlogList,
}