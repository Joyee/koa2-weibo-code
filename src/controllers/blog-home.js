/**
 * @description blog-home controller
 */

const { creatBlog, getFollowersBlogList } = require('../services/blog')
const { ErrorModel, SuccessModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const xss = require('xss')
const { PAGE_SIZE } = require('../conf/constant')

/**
 * 创建微博
 * @param {Object}} param0 
 */
async function create({ userId, content, image }) {
  try {
    const result = await creatBlog({
      userId,
      content: xss(content),
      image
    })
    return new SuccessModel(result)
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