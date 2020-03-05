/**
 * @description 微博 @ 关系 controller
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { getAtMeBlogList } = require('../../controllers/blog-at')
const { getBlogListStr } = require('../../utils/blog')

router.prefix('/api/atMe')

router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
  let { pageIndex } = ctx.params
  pageIndex = parseInt(pageIndex)
  const { id: userId } = ctx.session.userInfo

  const result = await getAtMeBlogList(userId, pageIndex)
  //  渲染模板
  result.data.blogListTpl = getBlogListStr(result.data.blogList)
  ctx.body = result
 })

module.exports = router