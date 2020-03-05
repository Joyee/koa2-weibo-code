/**
 * @description 微博 @ 关系 controller
 */

const { getAtRelationCount } = require('../services/at-relation')
const { SuccessModel } = require('../model/ResModel')
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

module.exports = {
  getAtMeCount,
}