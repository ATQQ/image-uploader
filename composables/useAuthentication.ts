import { ref, computed } from 'vue';

export function useAuthentication() {
  const secretKey = ref('');
  const isAuthenticated = ref(false);
  const isAuthenticating = ref(false);
  const accountName = ref('');
  
  // Check if authenticated from session storage
  const checkAuth = () => {
    if (process.client) {
      const storedKey = sessionStorage.getItem('secretKey');
      const storedAccountName = sessionStorage.getItem('accountName');
      
      if (storedKey && storedAccountName) {
        secretKey.value = storedKey;
        accountName.value = storedAccountName;
        isAuthenticated.value = true;
        return true;
      }
    }
    
    return false;
  };
  
  // Authenticate with secret key
  const authenticate = async (key) => {
    if (!key) {
      return {
        success: false,
        message: 'Secret key is required'
      };
    }
    
    isAuthenticating.value = true;
    
    try {
      const response = await $fetch('/api/auth/validate', {
        method: 'POST',
        body: {
          secretKey: key
        }
      });
      
      if (response.success) {
        secretKey.value = key;
        isAuthenticated.value = true;
        accountName.value = response.accountName;
        
        // Store in sessionStorage
        if (process.client) {
          sessionStorage.setItem('secretKey', key);
          sessionStorage.setItem('accountName', response.accountName);
        }
        
        return {
          success: true,
          accountName: response.accountName
        };
      } else {
        return {
          success: false,
          message: 'Invalid secret key'
        };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Authentication failed. Please try again.'
      };
    } finally {
      isAuthenticating.value = false;
    }
  };
  
  // Log out
  const logout = () => {
    isAuthenticated.value = false;
    secretKey.value = '';
    accountName.value = '';
    
    if (process.client) {
      sessionStorage.removeItem('secretKey');
      sessionStorage.removeItem('accountName');
    }
    
    return true;
  };
  
  return {
    secretKey,
    isAuthenticated,
    isAuthenticating,
    accountName,
    checkAuth,
    authenticate,
    logout
  };
}