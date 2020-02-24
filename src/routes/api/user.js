/**
 * 用户路由
 * 路由只需要负责 路由的派发和参数的获取
 */

const router = require('koa-router')()
const { isExist, register, login } = require('../../controllers/user')
const userValidate = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')
//  加前缀
router.prefix('/api/user')

// 注册路由
router.post('/register', genValidator(userValidate), async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    ctx.body = await register({userName, password, gender})
})

router.post('/isExist', async (ctx, next) => {
    // 参数获取
    const { userName } = ctx.request.body
    // controllers
    ctx.body = await isExist(userName)
})

router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    ctx.body = await login(ctx, userName, password)
})
module.exports = router