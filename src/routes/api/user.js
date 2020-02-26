/**
 * 用户路由
 * 路由只需要负责 路由的派发和参数的获取
 */

const router = require('koa-router')()
const { isExist, register, login, deleteCurUser, changeInfo } = require('../../controllers/user')
const userValidate = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')
const { loginCheck, loginRedirect } = require('../../middlewares/loginChecks')
const { isTest } = require('../../utils/env')
//  加前缀
router.prefix('/api/user')

// 注册路由
router.post('/register', genValidator(userValidate), async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    ctx.body = await register({ userName, password, gender })
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

router.post('/delete', loginCheck, async (ctx, next) => {
    if (isTest) {
        // 测试环境下，测试账号登录之后，删除自己
        const { userName } = ctx.session.userInfo
        ctx.body = await deleteCurUser(userName)
    }
})

router.patch('/changeInfo', loginRedirect, genValidator(userValidate), async (ctx, next) => {
    const { nickName, avatar, city } = ctx.request.body
    // controller
    ctx.body = await changeInfo(ctx, { nickName, avatar, city })
})

module.exports = router