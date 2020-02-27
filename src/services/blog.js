/**
 * @description blog service
 */

const { Blog } = require('../db/model/index')

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

module.exports = {
  creatBlog,
}