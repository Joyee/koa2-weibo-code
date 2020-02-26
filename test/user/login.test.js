/**
 * @description user api test
 */

const server = require('../server')

//  用户信息
const userName = `u_${Date.now()}`
const password = `p_${Date.now()}`
const testUser = {
    userName,
    password,
    nickName: userName,
    gender: 1
}

// 存储 cookie
let COOKIE = ''

// 注册
test('注册一个用户，应该成功', async () => {
    const res = await server
        .post('/api/user/register')
        .send(testUser)
    expect(res.body.errno).toBe(0)
})

// 重复注册
test('重复注册用户，应该失败', async () => {
    const res = await server
        .post('/api/user/register')
        .send(testUser)
    expect(res.body.errno).not.toBe(0)
})

// 查询用户是否存在
test('查询注册的用户名，应该存在', async () => {
    const res = await server
        .post('/api/user/isExist')
        .send({ userName })

    expect(res.body.errno).toBe(0)
})
// json schema检测
test('json schema 检测，非法的格式，注册应该失败', async () => {
    const res = await server
        .post('/api/user/register')
        .send({
            userName: '1234', // 用户名不是字母(或下划线)开通
            password: 'aaa', // 最小长度不是3
            // nickName: ''
            gender: 'mail' // 不是数字
        })
    expect(res.body.errno).not.toBe(0)
})
// 登录
test('登录，应该成功', async () => {
    const res = await server
        .post('/api/user/login')
        .send({
            userName,
            password
        })

    expect(res.body.errno).toBe(0)

    // 获取cookie
    COOKIE = res.headers['set-cookie'].join(';')
})

// 修改基本信息
test('修改基本信息应该成功', async () => {
    const res = await server
        .patch('/api/user/changeInfo')
        .send({
            nickName: '测试昵称',
            city: '测试城市',
            avavtar: '/123.png'
        })
        .set('cookie', COOKIE)
    expect(res.body.errno).toBe(0)
})

// 修改密码
test('修改密码应该成功', async () => {
    const res = await server
        .patch('/api/user/changePassword')
        .send({
            password,
            newPassword: `p_${Date.now()}`
        })
        .set('cookie', COOKIE)
    expect(res.body.errno).toBe(0)
})

// 删除
test('删除用户，应该成功', async () => {
    const res = await server
        .post('/api/user/delete')
        .set('cookie', COOKIE)

    expect(res.body.errno).toBe(0)
})

// 再次查询用户 应该不存在
test('删除之后再次查用户名，应该不存在', async () => {
    const res = await server
        .post('/api/user/isExist')
        .send({ userName })

    expect(res.body.errno).not.toBe(0)
})

// 退出
test('退出应该成功', async () => {
    const res = await server
        .post('/api/user/logout')
        .set('cookie', COOKIE)

    expect(res.body.errno).toBe(0)
})