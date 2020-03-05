/**
 * @description 微博相关
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controllers/blog-profile')
const { isExist } = require('../../controllers/user')
const { getSquareBlogList } = require('../../controllers/blog-square')
const { getFans, getFollowers } = require('../../controllers/user-relation')
const { getHomeBlogList } = require('../../controllers/blog-home')
const { getAtMeCount, getAtMeBlogList, markAsRead } = require('../../controllers/blog-at')

// 首页
router.get('/', loginRedirect, async (ctx, next) => {
  const userInfo = ctx.session.userInfo
  const { id: userId } = userInfo

  // 首页第一页数据
  const result = await getHomeBlogList(userId)
  const { isEmpty, count, pageIndex, pageSize, blogList } = result.data
  
  // 获取粉丝列表
  // controller
  const fansResult = await getFans(userId)
  const { count: fansCount, fansList } = fansResult.data

  // 获取关注人列表
  const followersResult = await getFollowers(userId)
  const { count: followersCount, followersList } = followersResult.data

  // 获取 @ 用户数量
  const atCountResult = await getAtMeCount(userId)
  const { count: atCount } = atCountResult.data

  await ctx.render('index', {
    userData: {
      userInfo,
      fansData: {
        count: fansCount,
        list: fansList
      },
      followersData: {
        count: followersCount,
        list: followersList
      },
      atCount,
    },
    blogData: {
      isEmpty,
      count,
      pageIndex,
      pageSize,
      blogList
    },
  })
})

// 个人主页
router.get('/profile', loginRedirect, async (ctx, next) => {
  const { userName } = ctx.session.userInfo
  ctx.redirect(`/profile/${userName}`)
})

router.get('/profile/:userName', loginRedirect, async (ctx, next) => {
  const myUserInfo = ctx.session.userInfo
  const myUserName = myUserInfo.userName

  const { userName: curUserName } = ctx.params
  const isMe = myUserName === curUserName

  let curUserInfo

  if (isMe) {
    // 是当前登录用户
    curUserInfo = myUserInfo
  } else {
    // 不是当前登录用户
    // 判断该用户是否存在
    const existUserInfo = await isExist(curUserName)
    if (existUserInfo.errno !== 0) {
      // 用户不存在
      return
    }
    curUserInfo = existUserInfo.data
  }

  // 获取微博列表第一页
  const result = await getProfileBlogList(curUserName, 0)
  const { isEmpty, count, pageIndex, pageSize, blogList } = result.data

  // 获取粉丝列表
  // controller
  const fansResult = await getFans(curUserInfo.id)
  const { count: fansCount, fansList } = fansResult.data

  // 获取关注人列表
  const followersResult = await getFollowers(curUserInfo.id)
  const { count: followersCount, followersList } = followersResult.data
  // 我是否关注了此人
  const amIFollowed = fansList.some(item => {
    return item.userName === myUserName
  })

  // 获取 @ 用户数量
  const atCountResult = await getAtMeCount(myUserInfo.id)
  const { count: atCount } = atCountResult.data

  await ctx.render('profile', {
    blogData: {
      isEmpty,
      count,
      blogList,
      pageSize,
      pageIndex
    },
    userData: {
      userInfo: curUserInfo,
      isMe,
      fansData: {
        count: fansCount,
        list: fansList
      },
      amIFollowed,
      followersData: {
        count: followersCount,
        list: followersList
      },
      atCount,
    }
  })
})
// 广场
router.get('/square', loginRedirect, async (ctx, next) => {
  const result = await getSquareBlogList(0)
  const { isEmpty, count, blogList, pageIndex, pageSize } = result.data || {}
  await ctx.render('square', {
    blogData: {
      isEmpty,
      count,
      blogList,
      pageSize,
      pageIndex
    }
  })
})

// atMe 路由
router.get('/at-me', loginRedirect, async (ctx, next) => {
  const { id: userId } = ctx.session.userInfo

  // 获取 @ 用户数量
  const atCountResult = await getAtMeCount(userId)
  const { count: atCount } = atCountResult.data

  // 获取第一页列表
  const result = await getAtMeBlogList(userId)
  const { isEmpty, count, blogList, pageIndex, pageSize } = result.data

  await ctx.render('atMe', {
    blogData: {
      isEmpty,
      blogList,
      count,
      pageIndex,
      pageSize,
    },
    atCount,
  })

  if (atCount > 0) {
    await markAsRead(userId)
  }
})

module.exports = router