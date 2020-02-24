/**
 * @description user controllers
 */

const { getUserInfo, createUser,deleteUser } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { 
    registerUserNameNotExistInfo, 
    registerUserNameExistInfo, 
    registerFailInfo, 
    loginFailInfo,
    deleteUserFailInfo,
 } = require('../model/ErrorInfo')
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

/**
 * 登录
 * @param {Object} ctx koa2 ctx
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function login(ctx, userName, password) {
    const userInfo = await getUserInfo(userName, doCrypto(password))

    if (!userInfo) {
        return new ErrorModel(loginFailInfo)
    }

    if (!ctx.session.userInfo) {
        ctx.session.userInfo = userInfo
    }

    return new SuccessModel()
}

/**
 * 删除当前用户
 * @param {string} userName 用户名
 */
async function deleteCurUser(userName) {
    const result = await deleteUser(userName)

    if (result) {
        return new SuccessModel()
    }

    return new ErrorModel(deleteUserFailInfo)
}

module.exports = {
    isExist,
    register,
    login,
    deleteCurUser,
}