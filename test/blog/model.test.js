/**
 * @description 微博数据模型单元测试
 */

 const { Blog } = require('../../src/db/model/index')

 test('微博数据模型各个属性，符合预期', () => {
   const blog = Blog.build({
     userId: 1,
     content: '测试内容',
     image: '/test.png'
   })
   expect(blog.userId).toBe(1)
   expect(blog.content).toBe('测试内容')
   expect(blog.image).toBe('/test.png')
 })