/**
 * @description sequelize 实例
 */

const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../conf/db')
const { isProd, isTest } = require('../utils/env')

const { host, user, password, database } = MYSQL_CONF
const conf = {
    host,
    dialect: 'mysql'
}

if (isTest) {
    conf.logging = () => {}
}

// 线上环境 使用连接池
if (isProd) {
    conf.pool = {
        max: 5,
        min: 0,
        idle: 10000 // 如果一个连接池10s内没有被使用，则释放
    }
}

const seq = new Sequelize(database, user, password, conf)

module.exports = seq