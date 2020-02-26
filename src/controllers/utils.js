/**
 * @description utils controller
 */

const path = require('path')
const fs = require('fs-extra')
const { uploadFileSizeFailInfo } = require('../model/ErrorInfo')
const { ErrorModel, SuccessModel } = require('../model/ResModel')

//  最大存储体积 1M
const MAX_SIZE = 1024 * 1024 * 1024
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadFiles')

// 是否需要创建目录
fs.pathExists(DIST_FOLDER_PATH).then(exist => {
  if (!exist) {
    fs.ensureDir(DIST_FOLDER_PATH)
  }
})

/**
 * 保存文件
 * @param {string} name 文件名
 * @param {string} size 文件大小
 * @param {string} type 文件类型
 * @param {string} filePath 文件路径
 */
async function saveFile({ name, size, type, filePath }) {
  if (size >= MAX_SIZE) {
    await fs.remove(filePath)
    return new ErrorModel(uploadFileSizeFailInfo)
  }

  // 移动文件
  const fileName = Date.now() + '.' + name // 重命名 避免重复覆盖
  const distFilePath = path.join(DIST_FOLDER_PATH, fileName)
  await fs.move(filePath, distFilePath)

  return new SuccessModel({
    url: '/' + fileName
  })
}

module.exports = {
  saveFile,
}