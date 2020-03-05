/**
 * @description 微博 @ 关系 controller
 */

const { getAtRelationCount, getAtUserBlogList } = require('../services/at-relation')
const { SuccessModel } = require('../model/ResModel')
const { PAGE_SIZE } = require('../conf/constant')
/**
 * 获取 @ 我的数量
 * @param {number} userId 用户id
 */
async function getAtMeCount(userId) {
  const count = await getAtRelationCount(userId)

  return new SuccessModel({
    count
  })
}

async function getAtMeBlogList(userId, pageIndex = 0) {
  const result = await getAtUserBlogList({userId, pageIndex, pageSize: PAGE_SIZE})

  const { count, blogList } = result

  return new SuccessModel({
    blogList,
    count,
    isEmpty: blogList.length === 0,
    pageSize: PAGE_SIZE,
    pageIndex
  })
}

module.exports = {
  getAtMeCount,
  getAtMeBlogList,
}