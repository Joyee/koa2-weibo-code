const router = require('koa-router')()
const { loginCheck, loginRedirect } = require('../middlewares/loginCheck')

router.get('/', loginRedirect, async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/json', loginCheck, async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/profile/:userName', async (ctx, next) => {
  const { userName } = ctx.params
  ctx.body = {
    title: 'this is profile page'
  }
})

router.get('/loadMore/:userName/:pageIndex', async (ctx, next) => {
  const { userName, pageIndex } = ctx.params

  ctx.body = {
    title: 'this is loadMore API.',
    userName,
    pageIndex
  }
})

module.exports = router
