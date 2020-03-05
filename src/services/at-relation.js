/**
 * @description 微博 @ 用户 service
 */

 const { AtRelation } = require('../db/model/index')

 /**
  * 创建微博 @ 用户到关系
  * @param {number} blogId 微博id
  * @param {number} userId 用户id
  */
 async function createAtRelation(blogId, userId) {
   const result = await AtRelation.create({
     blogId,
     userId
   })

   return result.dataValues
 }

 /**
  * 获取 at 用户的微博数量 (未读读)
  * @param {number} userId 用户id
  */
 async function getAtRelationCount(userId) {
   const result = await AtRelation.findAndCountAll({
     where: {
       userId,
       isRead: false
     }
   })

   return result.count
 }

 module.exports = {
   createAtRelation,
   getAtRelationCount,
 }