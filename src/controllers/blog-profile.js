/**
 * @description 个人主页 controller
 */

 const { getBlogListByUser } = require('../services/blog')
 const { PAGE_SIZE } = require('../conf/constant')
 const { SuccessModel } = require('../model/ResModel')

async function getProfileBlogList(userName, pageIndex = 0) {
  // services
  try {
    const result = await getBlogListByUser({userName, pageIndex, pageSize: PAGE_SIZE})
    const blogList = result.blogList

    return new SuccessModel({
      isEmpty: blogList.length === 0,
      blogList,
      count: result.count,
      pageIndex,
      pageSize: PAGE_SIZE,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getProfileBlogList,
}