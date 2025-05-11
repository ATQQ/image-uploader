import { defineEventHandler, readMultipartFormData } from 'h3';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { getSecretKeys } from '../../utils/secret';

export default defineEventHandler(async (event) => {
  try {
    // Get form data
    const formData = await readMultipartFormData(event);
    
    if (!formData) {
      return {
        success: false,
        message: 'No form data provided'
      };
    }
    
    // Get secret key
    const secretKeyField = formData.find(field => field.name === 'secretKey');
    
    if (!secretKeyField) {
      return {
        success: false,
        message: 'Secret key is required'
      };
    }
    
    const secretKey = Buffer.from(secretKeyField.data).toString('utf8');
    
    const secretKeys = getSecretKeys();
    
    if (!(secretKey in secretKeys)) {
      return {
        success: false,
        message: 'Invalid secret key'
      };
    }
    
    const accountName = secretKeys[secretKey];
    
    // Get image file
    const imageField = formData.find(field => field.name === 'image');
    
    if (!imageField) {
      return {
        success: false,
        message: 'No image provided'
      };
    }
    
    // Get custom name if provided
    const customNameField = formData.find(field => field.name === 'customName');
    const customName = customNameField ? Buffer.from(customNameField.data).toString('utf8') : null;
    
    // Determine file extension
    const fileExtension = extname(imageField.filename).toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!validExtensions.includes(fileExtension)) {
      return {
        success: false,
        message: 'Invalid file type. Allowed types: jpg, jpeg, png, gif, webp'
      };
    }
    
    // Create filename
    const filename = customName 
      ? `${customName}`
      // ? `${customName.replace(/[^a-zA-Z0-9-_]/g, '-')}${fileExtension}`
      : `${uuidv4()}${fileExtension}`;
    
    // Create directory path
    const uploadDir = join(process.cwd(), 'data', 'images', accountName);
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      return {
        success: false,
        message: 'Failed to create upload directory'
      };
    }
    
    // Write file
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, imageField.data);
    
    // Build URL
    // 获取 request header origin
    const origin = event.node.req.headers.origin;
    const siteUrl = origin || config.public.siteUrl;
    const url = `${siteUrl}/images/${accountName}/${filename}`;
    
    return {
      success: true,
      url,
      filename
    };
    
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: 'An error occurred during upload'
    };
  }
});