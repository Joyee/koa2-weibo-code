/**
 * @description 数据格式化
 */

const { DEFAULT_AVATAR } = require('../conf/constant')
/**
 * 用户默认头像
 * @param {Object} obj 用户对象
 */
function _formatAvatar(obj) {
    if (obj.avatar === null) {
        obj.avatar = DEFAULT_AVATAR
    }
    return obj
}

/**
 * 格式化用户信息
 * @param {Array|Object} list 用户列表或单个用户对象
 */
function formatUser(list) {
    if (list === null) {
        return list
    }

    if (list instanceof Array) {
        return list.map(_formatAvatar)
    }

    return _formatAvatar(list)
}

module.exports = {
    formatUser
}