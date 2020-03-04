/**
 * @description 用户关系 controller
 */

const { getUsersByFollower } = require('../services/user-relation')
const { SuccessModel } = require('../model/ResModel')
//  获取粉丝列表
async function getFans(followerId) {
  // services
  const { count, userList } = await getUsersByFollower(followerId)
  return new SuccessModel({
    count,
    fansList: userList
  })
}

module.exports = {
  getFans,
}