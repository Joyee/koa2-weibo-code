/**
 * @description 个人主页 API
 */

 const router = require('koa-router')()
 const { loginRedirect } = require('../../middlewares/loginChecks')
 const { getProfileBlogList } = require('../../controllers/blog-profile')
 const { getBlogListStr } = require('../../utils/blog')

 router.prefix('/api/profile')

 router.get('/loadMore/:userName/:pageIndex', loginRedirect, async (ctx, next) => {
   const { userName, pageIndex } = ctx.params
   const result = await getProfileBlogList(userName, pageIndex)

   result.data.blogListTpl = getBlogListStr(result.data.blogList)

   ctx.body = result
 })

 module.exports = router