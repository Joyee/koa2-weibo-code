/**
 * @description blog-home controller
 */

const { creatBlog, getFollowersBlogList } = require('../services/blog')
const { ErrorModel, SuccessModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const xss = require('xss')
const { PAGE_SIZE, REG_FOR_AT_WHO } = require('../conf/constant')
const { getUserInfo } = require('../services/user')
const { createAtRelation } = require('../services/at-relation')

/**
 * 创建微博
 * @param {Object}} param0 
 */
async function create({ userId, content, image }) {
  // 分析并收集 content 中的 @ 用户
  // content 格式如 '哈喽 @李四 - lisi 你好 @王五 - wangwu '
  const atUserNameList = []
  content = content.replace(
    REG_FOR_AT_WHO,
    (matchStr, nickName, userName) => {
      // 目的不是 replace 而是获取 userName
      atUserNameList.push(userName)
      return matchStr // 替换不生效，预期
    }
  )

  // 根据 @ 用户名查询用户信息
  const atUserList = await Promise.all(
    atUserNameList.map((userName) => getUserInfo(userName))
  )

  // 根据用户信息 获取用户id
  const atUserIdList = atUserList.map(user => user.id)

  try {
    const blog = await creatBlog({
      userId,
      content: xss(content),
      image
    })

    // 创建 @ 关系
    // 微博是一个  用户可能是多个
    await Promise.all(atUserIdList.map(
      userId => createAtRelation(blog.id, userId)
    ))

    return new SuccessModel(blog)
  } catch (error) {
    console.log('创建微博失败:', error)
    return new ErrorModel(createBlogFailInfo)
  }
}

/**
 * 获取首页微博列表
 * @param {number} userId 
 * @param {number} pageIndex 
 */
async function getHomeBlogList(userId, pageIndex = 0) {
  const result = await getFollowersBlogList({ userId, pageIndex, pageSize: PAGE_SIZE })
  const { count, blogList } = result

  return new SuccessModel({
    isEmpty: blogList.length === 0,
    blogList,
    pageSize: PAGE_SIZE,
    pageIndex,
    count
  })
}

module.exports = {
  create,
  getHomeBlogList,
}