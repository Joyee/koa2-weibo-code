/**
 * @description 微博 @ 用户 service
 */

const { AtRelation, User, Blog } = require('../db/model/index')
const { formatBlog, formatUser } = require('./_format')

/**
 * 创建微博 @ 用户到关系
 * @param {number} blogId 微博id
 * @param {number} userId 用户id
 */
async function createAtRelation(blogId, userId) {
  const result = await AtRelation.create({
    blogId,
    userId
  })

  return result.dataValues
}

/**
 * 获取 at 用户的微博数量 (未读读)
 * @param {number} userId 用户id
 */
async function getAtRelationCount(userId) {
  const result = await AtRelation.findAndCountAll({
    where: {
      userId,
      isRead: false
    }
  })

  return result.count
}

/**
 * 获取 @ 用户的微博列表
 * @param {Object} param0 查询条件 { userId, pageIndex = 0, pageSize = 10 }
 */
async function getAtUserBlogList({ userId, pageIndex = 0, pageSize = 10 }) {
  const result = await Blog.findAndCountAll({
    limit: pageSize,
    offset: pageSize * pageIndex,
    order: [
      ['id', 'desc']
    ],
    include: [
      // @ 关系
      {
        model: AtRelation,
        attributes: ['blogId', 'userId'],
        where: { userId }
      },
      // User
      {
        model: User,
        attributes: ['userName', 'nickName', 'avatar']
      }
    ]
  })

  // result.rows
  // result.count
  let blogList = result.rows.map((row) => row.dataValues)
  blogList = formatBlog(blogList)

  blogList = blogList.map((blogItem) => {
    blogItem.user = formatUser(blogItem.user.dataValues)
    return blogItem
  })

  return {
    blogList,
    count: result.count
  }
}

/**
 * 更新 AtRelation
 * @param {Object} param0 更新内容
 * @param {Object} param1 查询条件
 */
async function updateAtRelation(
  { newIsRead }, // 要更新的内容
  { userId, isRead } // 条件
) { 
  // 拼接更新内容
  let updateData = {}
  if (newIsRead) {
    updateData.isRead = newIsRead
  }
  // 拼接查询条件
  let whereOpt = {}
  if (userId) {
    whereOpt.userId = userId
  }
  if (isRead) {
    whereOpt.isRead = isRead
  }

  // 执行更新
  const result = await AtRelation.update(updateData, {
    where: whereOpt
  })

  return result[0] > 0
}

module.exports = {
  createAtRelation,
  getAtRelationCount,
  getAtUserBlogList,
  updateAtRelation,
}