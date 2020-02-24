/**
 * @description user model test
 */

 const { User } = require('../../src/db/model/index')

 test('User模型的各个属性，符合预期', () => {
    //  build会构建一个内存User实例，但不会提交到数据库
     const user = User.build({
         userName: 'zhangsan',
         password: '123456',
         nickName: '张三',
         avatar: 'xxxx.png',
         city: '北京'
     })
    //  验证各个属性
    expect(user.userName).toBe('zhangsan')
    expect(user.password).toBe('123456')
    expect(user.nickName).toBe('张三')
    expect(user.gender).toBe(3)
    expect(user.avatar).toBe('xxxx.png')
    expect(user.city).toBe('北京')
 })