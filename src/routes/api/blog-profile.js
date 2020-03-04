/**
 * @description 个人主页 API
 */

const router = require('koa-router')()
const { loginRedirect, loginCheck } = require('../../middlewares/loginChecks')
const { getProfileBlogList, follow, unFollow } = require('../../controllers/blog-profile')
const { getBlogListStr } = require('../../utils/blog')

router.prefix('/api/profile')

router.get('/loadMore/:userName/:pageIndex', loginRedirect, async (ctx, next) => {
  const { userName, pageIndex } = ctx.params
  const result = await getProfileBlogList(userName, pageIndex)

  result.data.blogListTpl = getBlogListStr(result.data.blogList)

  ctx.body = result
})

//  关注用户
router.post('/follow', loginCheck, async (ctx, next) => {
  const { id: myUserId } = ctx.session.userInfo
  const { userId: curUserId } = ctx.request.body
  ctx.body = await follow(myUserId, curUserId)
})

// 取消关注
router.post('/unFollow', loginCheck, async (ctx, next) => {
  const { id: myUserId } = ctx.session.userInfo
  const { userId: curUserId } = ctx.request.body
  ctx.body = await unFollow(myUserId, curUserId)
})

module.exports = router