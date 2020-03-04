/**
 * @description 个人主页 controller
 */

 const { getBlogListByUser } = require('../services/blog')
 const { PAGE_SIZE } = require('../conf/constant')
 const { SuccessModel, ErrorModel } = require('../model/ResModel')
 const { addFollowerFailInfo, deleteFollowerFailInfo } = require('../model/ErrorInfo')
 const { addFollower, deleteFollower } = require('../services/user-relation')

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

/**
 * 关注
 * @param {numbser} myUserId 当前登录用户 id
 * @param {number} curUserId 被关注用户id
 */
async function follow(myUserId, curUserId) {
  try {
    await addFollower(myUserId, curUserId)

    return new SuccessModel()
  } catch (error) {
    console.log(error)
    return new ErrorModel(addFollowerFailInfo)
  }
}

/**
 * 取消关注
 * @param {number} myUserId 当前登录用户id
 * @param {*} curUserId 被关注用户id
 */
async function unFollow(myUserId, curUserId) {
  try {
    await deleteFollower(myUserId, curUserId)
    return new SuccessModel()
  } catch (error) {
    return new ErrorModel(deleteFollowerFailInfo)
  }
}

module.exports = {
  getProfileBlogList,
  follow,
  unFollow,
}