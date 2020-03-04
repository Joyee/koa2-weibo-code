/**
 * @description 首页 API路由
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { create, getHomeBlogList } = require('../../controllers/blog-home')
const blogValidata = require('../../validator/blog')
const { genValidator } = require('../../middlewares/validator')
const { getBlogListStr } = require('../../utils/blog')

router.prefix('/api/blog')

router.post('/create', loginCheck, genValidator(blogValidata), async (ctx, next) => {
  const { content, image } = ctx.request.body
  const { id: userId } = ctx.session.userInfo
  // controller
  ctx.body = await create({ userId, content, image })
})

router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
  let { pageIndex } = ctx.params
  pageIndex = parseInt(pageIndex)
  const { id: userId } = ctx.session.userInfo

  const result = await getHomeBlogList(userId, pageIndex)
  //  渲染模板
  result.data.blogListTpl = getBlogListStr(result.data.blogList)
  ctx.body = result
})

module.exports = router