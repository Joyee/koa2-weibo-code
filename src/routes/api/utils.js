/**
 * @description utils api路由
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const koaForm = require('formidable-upload-koa')
const { saveFile } = require('../../controllers/utils')
router.prefix('/api/utils')

//  上传图片
router.post('/upload', loginRedirect, koaForm(), async (ctx, next) => {
  const file = ctx.req.files['file']
  const { size, name, path, type } = file
  // controllers
  ctx.body = await saveFile({
    size,
    name,
    type,
    filePath: path
  })
})

module.exports = router