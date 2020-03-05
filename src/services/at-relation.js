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

 module.exports = {
   createAtRelation,
 }