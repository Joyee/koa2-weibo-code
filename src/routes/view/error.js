/**
 * @description error
 * @author qiuxiaofeng
 */
const router = require('koa-router')()

router.get('/get-an-error', async (ctx, next) => {
    throw Error()
    ctx.body = {
        msg: 'xxx'
    }
})

// error
router.get('/error', async (ctx, next) => {
    await ctx.render('404')
})

module.exports = router