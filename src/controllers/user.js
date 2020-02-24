/**
 * @description user controllers
 */

const { getUserInfo } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { registerUserNameIsExist } = require('../model/ErrorInfo')

async function isExist(userName) {
    //  业务逻辑 无
    // 调用 services获取数据
    // 返回统一格式
    const userInfo = await getUserInfo(userName)

    if (userInfo) {
        return new SuccessModel(userInfo)
    } else {
        return new ErrorModel(registerUserNameIsExist)
    }
}

module.exports = {
    isExist
}