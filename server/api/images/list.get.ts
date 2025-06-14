import { promises as fs } from 'fs';
import path, { join } from 'path';
import { getSecretKeys } from '~/utils/secret';

export default defineEventHandler(async (event) => {
  // 假设图片都存放在 public/uploads 目录下

  try {
    // Get secret key
    const secretKeyField = getHeader(event, 'Authorization')?.replace('Bearer ', '');

    if (!secretKeyField) {
      return {
        success: false,
        message: 'Secret key is required'
      };
    }

    const secretKey = secretKeyField;
    const secretKeys = getSecretKeys();
    const accountName = secretKeys[secretKey];

    const uploadDir = join(process.cwd(), 'data', 'images', accountName);

    const files = await fs.readdir(uploadDir);
    const origin = getHeader(event, 'origin') || new URL(getHeader(event, 'referer')!).origin;

    // 只返回图片文件（可根据实际情况过滤）
    const images = await Promise.all(files.map(async file => ({
      url: `${origin}/images/${accountName}/${file}`,
      name: file,
      uploadedAt: (await fs.stat(join(uploadDir, file))).mtime.toISOString() // 使用文件的修改时间作为上传时间
    })));

    // 按上传时间倒序排序
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return {
      success: true,
      images
    };
  } catch (err) {
    return {
      success: false,
      message: '读取图片列表失败'
    };
  }
});