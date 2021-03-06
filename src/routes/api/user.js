/**
 * 用户路由
 * 路由只需要负责 路由的派发和参数的获取
 */

const router = require('koa-router')()
const { isExist, register, login, deleteCurUser, changeInfo, changePassword, logout } = require('../../controllers/user')
const userValidata = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')
const { loginCheck, loginRedirect } = require('../../middlewares/loginChecks')
const { isTest } = require('../../utils/env')
const { getFollowers } = require('../../controllers/user-relation')
//  加前缀
router.prefix('/api/user')

// 注册路由
router.post('/register', genValidator(userValidata), async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    ctx.body = await register({ userName, password, gender })
})

// 检测用户是否存在
router.post('/isExist', async (ctx, next) => {
    // 参数获取
    const { userName } = ctx.request.body
    // controllers
    ctx.body = await isExist(userName)
})
// 登录
router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    ctx.body = await login(ctx, userName, password)
})

// 删除
router.post('/delete', loginCheck, async (ctx, next) => {
    if (isTest) {
        // 测试环境下，测试账号登录之后，删除自己
        const { userName } = ctx.session.userInfo
        ctx.body = await deleteCurUser(userName)
    }
})

// 修改个人信息
router.patch('/changeInfo', loginRedirect, genValidator(userValidata), async (ctx, next) => {
    console.log(ctx.request.body)
    const { nickName, avatar, city } = ctx.request.body
    // controller
    ctx.body = await changeInfo(ctx, { nickName, avatar, city })
})

// 修改密码
router.patch('/changePassword', loginRedirect, genValidator(userValidata), async (ctx, next) => {
    const { password, newPassword } = ctx.request.body
    const { userName } = ctx.session.userInfo
    ctx.body = await changePassword(userName, password, newPassword)
})

// 退出登录
router.post('/logout', loginRedirect, async (ctx, next) => {
    ctx.body = await logout(ctx)
})

// 获取at列表 即关注人列表
router.get('/getAtList', loginRedirect, async (ctx, next) => {
    const { id } = ctx.session.userInfo
    const result = await getFollowers(id)
    const { followersList } = result.data
    let list = followersList.map((user) => {
        return `${user.nickName} - ${user.userName}`
    })

    ctx.body = list
})

module.exports = router