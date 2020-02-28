/**
 * @description 数据格式化
 */

const { DEFAULT_AVATAR } = require('../conf/constant')
const { timeFormat } = require('../utils/dt')
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

/**
 * 格式化时间数据
 * @param {Object} obj 
 */
function _formatDBTime(obj) {
    obj.createdAtFormat = timeFormat(obj.createdAt)
    obj.updateAtFormat = timeFormat(obj.updatedAt)
    return obj
}

/**
 * 格式化微博信息
 * @param {Array|Object} list 微博列表或单个微博对象
 */
function formatBlog(list) {
    if (list === null) {
        return list
    }
    if (list instanceof Array) {
        return list.map(_formatDBTime)
    }

    return _formatDBTime(list)
}

module.exports = {
    formatUser,
    formatBlog,
}