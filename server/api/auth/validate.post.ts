import { defineEventHandler, readBody } from 'h3';

import { getSecretKeys } from '../../../utils/secret';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { secretKey } = body;
  
  // Get config
  const secretKeys = getSecretKeys();
  
  // Validate the key
  if (!secretKey) {
    return {
      success: false,
      message: 'Secret key is required'
    };
  }
  
  // Check if the key exists in our configuration
  if (secretKey in secretKeys) {
    return {
      success: true,
      accountName: secretKeys[secretKey]
    };
  }
  
  return {
    success: false,
    message: 'Invalid secret key'
  };
});