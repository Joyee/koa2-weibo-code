/**
 * @description blog-home controller
 */

const { creatBlog } = require('../services/blog')
const { ErrorModel, SuccessModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const xss = require('xss')

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

module.exports = {
  create,
}