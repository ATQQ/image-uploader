import { defineEventHandler } from 'h3'
import { join } from 'path'
import { createReadStream, existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  // 移除 URL 中的查询参数
  const path = event.node.req.url?.split('?')[0] || ''

  // 只处理 /images/ 开头的请求
  if (!path.startsWith('/images/')) {
    return
  }

  try {
    // 从路径中提取用户名和图片名
    const parts = path.split('/').filter(Boolean)
    if (parts.length !== 3) {
      throw new Error('Invalid image path')
    }

    const [, user, imagename] = parts

    if (!user || !imagename) {
      throw new Error('Missing user or image name')
    }

    // 构建图片路径
    const imagePath = join(process.cwd(), 'data', 'images', user, decodeURIComponent(imagename))

    // 检查文件是否存在
    if (!existsSync(imagePath)) {
      throw new Error('Image not found')
    }

    // 设置响应头
    // 根据图片后缀设置对应的 Content-Type
    const extension = imagename.split('.').pop()?.toLowerCase() || ''
    let contentType = 'image/jpeg' // 默认类型

    switch (extension) {
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
      case 'jpg':
      case 'jpeg':
      default:
        contentType = 'image/jpeg'
        break
    }
    event.node.res.setHeader('Content-Type', contentType)
    // 设置不缓存图片的响应头
    event.node.res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    event.node.res.setHeader('Pragma', 'no-cache')
    event.node.res.setHeader('Expires', '0')

    // 读取图片文件
    // 使用流的方式读取和发送图片，避免大图片占用内存
    const stream = createReadStream(imagePath)
    return sendStream(event, stream)

    // 注意：使用流方式后，不再需要下面的 readFile 和 return imageBuffer 代码
    // 因此，请删除或注释掉下面两行代码
    // const imageBuffer = await readFile(imagePath)
    // return imageBuffer
  } catch (error) {
    console.error('Error serving image:', error)
    throw createError({
      statusCode: 404,
      message: 'Image not found'
    })
  }
}) 