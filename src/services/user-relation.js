/**
 * @description 用户关系 services
 */

const { User, UserRelation } = require('../db/model/index')
const { formatUser } = require('./_format')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
/**
 * 获取关注用户列表 即获取粉丝
 * @param {number} followerId 被关注用户id
 */
async function getUsersByFollower(followerId) {
  const result = await User.findAndCountAll({
    attributes: ['id', 'userName', 'nickName', 'avatar'],
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: UserRelation,
        where: {
          followerId,
          userId: {
            [Op.ne]: followerId
          } 
        }
      }
    ]
  })
  // result.count
  // result.rows
  let userList = result.rows.map((row) => row.dataValues)
  userList = formatUser(userList)

  return {
    count: result.count,
    userList
  }
}

/**
 *  添加关注关系
 * @param {number} userId 用户id
 * @param {number} followerId 被关注用户 id
 */
async function addFollower(userId, followerId) {
  const result = await UserRelation.create({
    userId,
    followerId
  })

  return result.dataValues
}

/**
 * 删除关注关系
 * @param {number} userId 用户id
 * @param {number} followerId 被关注用户id
 */
async function deleteFollower(userId, followerId) {
  const result = await UserRelation.destroy({
    where: {
      userId,
      followerId
    }
  })
  // 删除的行数
  return result > 0
}

/**
 * 获取关注人列表
 * @param {number} userId 
 */
async function getFollowersByUserId(userId) {
  const result = await UserRelation.findAndCountAll({
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: User,
        attributes: ['id', 'userName', 'nickName', 'avatar']
      }
    ],
    where: {
      userId,
      followerId: {
        [Op.ne]: userId // followerId !== userId
      }
    }
  })
  // result.count
  // result.rows
  let userList = result.rows.map((item) => {
    let user = item.user
    user = user.dataValues
    user = formatUser(user)
    return user
  })

  return {
    count: result.count,
    userList
  }
}

module.exports = {
  getUsersByFollower,
  addFollower,
  deleteFollower,
  getFollowersByUserId,
}