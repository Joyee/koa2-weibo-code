/**
 * @description 登录验证中间件
 */

const { ErrorModel } = require('../model/ResModel')
const { loginCheckFailInfo } = require('../model/ErrorInfo')

/**
 * API 登录验证
 * @param {Object} ctx koa2 ctx
 * @param {Function} next
 */
async function loginCheck(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        // 已登录
        await next()
        return
    }

    // 未登录
    ctx.body = new ErrorModel(loginCheckFailInfo)
}

/**
 * 页面登录验证
 */
async function loginRedirect(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        await next()
        return
    }

    const curUrl = ctx.url

    ctx.redirect(`/login?url=${encodeURIComponent(curUrl)}`)
}

module.exports = {
    loginCheck,
    loginRedirect,
}