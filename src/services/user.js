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

/**
 * 创建用户
 * @param {string} userName 用户名 
 * @param {string} password 密码 
 * @param {string} nickName 昵称 
 * @param {string} gender 性别 
 */
async function createUser({ userName, password, nickName, gender = 3 }) {
    const result = await User.create({
        userName,
        password,
        gender,
        nickName: nickName ? nickName : userName
    })

    return result.dataValues
}

/**
 * 删除用户
 * @param {string} userName 用户名
 */
async function deleteUser(userName) {
    const result = await User.destroy({
        where: {
            userName
        }
    })

    // 删除的行数
    return result > 0
}

async function updateUser(
    { newNickName, newPassword, newCity, newAvatar },
    { userName, password }
) {
    // 拼接修改内容
    let updateData = {}
    if (newNickName) {
        updateData.nickName = newNickName
    }
    if (newPassword) {
        updateData.password = newPassword
    }
    if (newCity) {
        updateData.city = newCity
    }
    if (newAvatar) {
        updateData.avatar = newAvatar
    }
    // 拼接查询条件
    let whereOpt = {
        userName
    }

    if (password) {
        whereOpt.password = password
    }
    // 执行修改
    const result = await User.update(updateData, {
        where: whereOpt
    })

    return result[0] > 0
}

module.exports = {
    getUserInfo,
    createUser,
    deleteUser,
    updateUser,
}