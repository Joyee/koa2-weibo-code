/**
 * @description user service
 * 数据处理
 * 格式化
 */

const { User } = require('../db/model/index')
const { formatUser } = require('./_format')
/**
 * 获取用户信息
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function getUserInfo(userName, password) {
    const whereOpt = {
        userName
    }

    if (password) {
        Object.assign(whereOpt, { password })
    }

    const result = await User.findOne({
        attributes: ['id', 'userName', 'nickName', 'avatar', 'city'],
        where: whereOpt
    })

    if (result === null) {
        return result
    }

    return formatUser(result.dataValues)
}

module.exports = {
    getUserInfo
}