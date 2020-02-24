/**
 * 用户路由
 * 路由只需要负责 路由的派发和参数的获取
 */

const router = require('koa-router')()
const { isExist } = require('../../controllers/user')

//  加前缀
router.prefix('/api/user')

// 注册路由
router.post('/register', async (ctx, next) => {

})

router.post('/isExist', async (ctx, next) => {
    // 参数获取
    const { userName } = ctx.request.body
    // controllers
    ctx.body = await isExist(userName)
})

module.exports = router