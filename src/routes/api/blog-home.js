/**
 * @description 首页 API路由
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { create } = require('../../controllers/blog-home')
const blogValidata = require('../../validator/blog')
const { genValidator } = require('../../middlewares/validator')

router.prefix('/api/blog')

router.post('/create', loginCheck, genValidator(blogValidata), async (ctx, next) => {
  const { content, image } = ctx.request.body
  const { id: userId } = ctx.session.userInfo
  // controller
  ctx.body = await create({ userId, content, image })
})

module.exports = router