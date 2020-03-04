/**
 * @description blog service
 */

const { Blog, User, UserRelation } = require('../db/model/index')
const { formatUser, formatBlog } = require('./_format')
/**
 * 创建微博
 * @param {Object} param0 创建微博所需数据 {userId, content, image}  
 */
async function creatBlog({ userId, content, image }) {
  const result = await Blog.create({
    userId,
    content,
    image
  })

  return result.dataValues
}

/**
 * 根据用户名查询微博列表
 * @param {Object} param0 查询参数 {userName, pageIndex, pageSize}
 */
async function getBlogListByUser({ userName, pageIndex = 0, pageSize = 10 }) {
  // 拼接查询条件
  const userWhereOpts = {}
  if (userName) {
    userWhereOpts.userName = userName
  }
  // 执行查询
  const result = await Blog.findAndCountAll({
    limit: pageSize, //每页多少条
    offset: pageSize * pageIndex, // 跳过多少条
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: User,
        attributes: ['userName', 'nickName', 'avatar'],
        where: userWhereOpts
      }
    ]
  })
  // result.count //总页数
  // result.rows 查询结果
  // 获取 dataValues
  let blogList = result.rows.map(row => formatBlog(row.dataValues))
  blogList = blogList.map((blogItem) => {
    const user = blogItem.user.dataValues
    blogItem.user = formatUser(user)
    return blogItem
  })

  return {
    count: result.count,
    blogList
  }
}

/**
 * 获取关注者的微博列表
 * @param {Object} param0 查询条件
 */
async function getFollowersBlogList({ userId, pageIndex = 0, pageSize = 10}) {
  const result = await Blog.findAndCountAll({
    limit: pageSize,
    offset: pageIndex * pageSize,
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: User,
        attributes: ['userName', 'nickName', 'avatar']
      },
      {
        model: UserRelation,
        attributes: ['userId', 'followerId'],
        where: { userId }
      }
    ]
  })

  // 格式化数据
  let blogList = result.rows.map((row) => row.dataValues)
  blogList = formatBlog(blogList)
  blogList = blogList.map((blogItem) => {
    blogItem.user = formatUser(blogItem.user.dataValues)
    return blogItem
  })

  return {
    count: result.count,
    blogList
  }
}

module.exports = {
  creatBlog,
  getBlogListByUser,
  getFollowersBlogList,
}