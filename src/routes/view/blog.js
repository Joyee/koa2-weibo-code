/**
 * @description 微博相关
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controllers/blog-profile')
const { isExist } = require('../../controllers/user')
const { getSquareBlogList } = require('../../controllers/blog-square')
const { getFans, getFollowers } = require('../../controllers/user-relation')

// 首页
router.get('/', loginRedirect, async (ctx, next) => {
  await ctx.render('index', {})
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
      }
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

module.exports = router