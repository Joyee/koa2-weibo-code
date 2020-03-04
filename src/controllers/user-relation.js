/**
 * @description 用户关系 controller
 */

const { getUsersByFollower, getFollowersByUserId } = require('../services/user-relation')
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

// 获取关注人列表
async function getFollowers(userId) {
  const { count, userList } = await getFollowersByUserId(userId)
  return new SuccessModel({
    count,
    followersList: userList
  })
}

module.exports = {
  getFans,
  getFollowers,
}