/**
 * @description user controllers
 */

const { getUserInfo, createUser } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { registerUserNameNotExistInfo, registerUserNameExistInfo, registerFailInfo } = require('../model/ErrorInfo')
const doCrypto = require('../utils/cryp')

/**
 * 用户名是否存在
 * @param {String} userName 用户名
 */
async function isExist(userName) {
    //  业务逻辑 无
    // 调用 services获取数据
    // 返回统一格式
    const userInfo = await getUserInfo(userName)

    if (userInfo) {
        return new SuccessModel(userInfo)
    } else {
        return new ErrorModel(registerUserNameNotExistInfo)
    }
}

/**
 * 注册
 * @param {String} userName 用户名 
 * @param {String} password 密码 
 * @param {Number} gender 性别 1 男 2 女 3 保密
 */
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName)

    if (userInfo) {
        return new ErrorModel(registerUserNameExistInfo)
    }

    try {
        await createUser({
            userName,
            password: doCrypto(password),
            gender
        })
        return new SuccessModel()
    } catch (error) {
        console.error(error.message, error.stacks)
        return new ErrorModel(registerFailInfo)
    }
}

module.exports = {
    isExist,
    register,
}