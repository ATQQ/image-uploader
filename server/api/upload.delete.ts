import { defineEventHandler, readMultipartFormData } from 'h3';
import { existsSync } from 'node:fs';
import { mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
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

    // Validate key
    const config = useRuntimeConfig();
    const secretKeys = getSecretKeys();

    if (!(secretKey in secretKeys)) {
      return {
        success: false,
        message: 'Invalid secret key'
      };
    }

    const accountName = secretKeys[secretKey];

    // Get custom name if provided
    const customNameField = formData.find(field => field.name === 'customName');
    const customName = customNameField ? Buffer.from(customNameField.data).toString('utf8') : null;

    if (!customName) {
      return {
        success: false,
        message: 'Custom name is required'
      };
    }

    // Create filename
    const filename = customName

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
    if (existsSync(filePath)) {
      await unlink(filePath);
    } else {
      return {
        success: false,
        message: 'File not found'
      };
    }

    return {
      success: true,
    };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      message: 'An error occurred during delete'
    };
  }
});