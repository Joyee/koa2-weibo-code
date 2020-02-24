/**
 * @description json schema 验证中间件
 */

const { ErrorModel } = require('../model/ResModel')
const { jsonSchemaFileInfo } = require('../model/ErrorInfo')
/**
 * 生产 json schema 验证的中间件
 * @param {function} validateFn 验证函数
 */
function genValidator(validateFn) {
    // 定义中间件
    async function validator(ctx, next) {
        const data = ctx.request.body
        const error = validateFn(data)

        if (error) {
            // 验证失败
            ctx.body = new ErrorModel(jsonSchemaFileInfo)
            return
        }
        await next()
    }
    // 返回中间件
    return validator
}

module.exports = {
    genValidator,
}