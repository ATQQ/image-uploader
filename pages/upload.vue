<template>
  <div class="py-8 px-4 container mx-auto max-w-4xl">
    <h1 class="text-3xl font-bold mb-8 text-center">Upload Images</h1>

    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Authentication</h2>

      <div class="mb-6">
        <label for="secretKey" class="block mb-2 text-neutral-700">Secret Key</label>
        <input id="secretKey" v-model="secretKey" type="password" class="input" placeholder="Enter your secret key"
          :disabled="isAuthenticated" />
      </div>

      <div v-if="!isAuthenticated" class="flex justify-end">
        <button @click="authenticate" class="btn-primary" :disabled="isAuthenticating">
          <span v-if="isAuthenticating">Authenticating...</span>
          <span v-else>Authenticate</span>
        </button>
      </div>

      <div v-else
        class="flex items-center justify-between p-3 bg-success-500 bg-opacity-10 text-success-500 rounded-lg">
        <div class="flex items-center gap-2">
          <IconCheck />
          <span>Authenticated as <strong>{{ accountName }}</strong></span>
        </div>
        <button @click="logout" class="btn-secondary text-sm">Logout</button>
      </div>
    </div>

    <div v-if="isAuthenticated" class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Upload Images</h2>

      <div
        class="border-2 border-dashed border-neutral-300 rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors hover:border-primary-400 hover:bg-primary-50"
        :class="{ 'border-primary-500 bg-primary-50': isDragging }" @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileSelect" />
        <IconUpload class="w-12 h-12 mx-auto mb-4 text-neutral-500" />
        <p class="text-neutral-700 mb-2">Drag and drop your images here</p>
        <p class="text-neutral-500 text-sm">or click to browse</p>
      </div>

      <div class="mb-4" v-if="selectedFiles.length > 0">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">Selected Images ({{ selectedFiles.length }})</h3>
          <button @click="selectedFiles = []" class="text-sm text-neutral-600 hover:text-error-500">
            Clear All
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="(file, index) in selectedFiles" :key="index"
            class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <div class="w-12 h-12 rounded-lg bg-cover bg-center bg-neutral-200"
              :style="{ backgroundImage: `url(${file.preview})` }"></div>
            <div class="flex-grow">
              <div class="flex items-center gap-2">
                <input v-model="file.customName" class="input text-sm py-1" placeholder="Custom filename (optional)" />
              </div>
              <div class="text-xs text-neutral-500 mt-1">
                {{ formatFileSize(file.size) }} | {{ file.type }}
              </div>
            </div>
            <button @click="removeFile(index)" class="text-neutral-500 hover:text-error-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button @click="uploadFiles" class="btn-primary" :disabled="isUploading || selectedFiles.length === 0">
          <span v-if="isUploading">Uploading...</span>
          <span v-else>Upload {{ selectedFiles.length }} {{ selectedFiles.length === 1 ? 'Image' : 'Images' }}</span>
        </button>
      </div>
    </div>

    <div v-if="uploadedImages.length > 0" class="bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Uploaded Images</h2>

      <div class="space-y-4">
        <div v-for="(image, index) in uploadedImages" :key="index" class="p-4 bg-neutral-50 rounded-lg">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-lg bg-cover bg-center" :style="{ backgroundImage: `url(${wrapperUrl(image.url)})` }">
            </div>
            <div class="flex-grow">
              <div class="text-sm font-medium mb-1">{{ getImageName(image.url) }}</div>
              <div class="flex items-center gap-2">
                <input type="text" readonly :value="image.url" class="input text-sm py-1 flex-grow" />
                <button @click="copyToClipboard(image.url)" class="btn-secondary p-2">
                  <IconCopy class="w-5 h-5" />
                </button>
                <!-- 删除按钮 -->
                <button @click="removeImage(index)" class="btn-secondary p-2">
                  <IconTrash class="w-5 h-5" />
                </button>
                <!-- 预览按钮 -->
                <button @click="openPreview(image.url)" class="btn-secondary p-2">
                  <IconEye class="w-5 h-5" />
                </button>
              </div>
              <!-- 展示上传时间 -->
              <div class="text-xs text-neutral-500 mt-1">{{ new Date(image.uploadedAt).toLocaleString() || 'Unknown' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconCopy from '@/components/icons/IconCopy.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconEye from '@/components/icons/icon-eye.vue';
import IconUpload from '@/components/icons/IconUpload.vue';
import IconCheck from '@/components/icons/IconCheck.vue';
import { useToast } from "vue-toastification";
const toast = useToast();

const auth = useState('auth', () => ({
  isAuthenticated: false,
  secretKey: '',
  accountName: ''
}));

const secretKey = ref('');
const isAuthenticated = computed(() => auth.value.isAuthenticated);
const isAuthenticating = ref(false);
const accountName = computed(() => auth.value.accountName);

// Upload state
const selectedFiles = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadedImages = ref([]);
const fileInput = ref(null);

// Load uploaded images and check authentication on client-side only
onMounted(() => {
  if (import.meta.client) {
    const savedImages = localStorage.getItem('uploadedImages');
    if (savedImages) {
      uploadedImages.value = JSON.parse(savedImages);
    }

    // Check if key is stored in localStorage
    const storedKey = localStorage.getItem('secretKey');
    const storedAccountName = localStorage.getItem('accountName');
    if (storedKey && storedAccountName) {
      secretKey.value = storedKey;
      auth.value = {
        isAuthenticated: true,
        secretKey: storedKey,
        accountName: storedAccountName
      };
    }
  }
});

// Authenticate with secret key
const authenticate = async () => {
  if (!secretKey.value) {
    toast.error('Please enter a secret key');
    return;
  }

  isAuthenticating.value = true;

  try {
    const response = await $fetch('/api/auth/validate', {
      method: 'POST',
      body: {
        secretKey: secretKey.value
      }
    });

    if (response.success) {
      auth.value = {
        isAuthenticated: true,
        secretKey: secretKey.value,
        accountName: response.accountName
      };

      // Store in localStorage
      if (import.meta.client) {
        localStorage.setItem('secretKey', secretKey.value);
        localStorage.setItem('accountName', response.accountName);
      }

      toast.success(`Authenticated as ${response.accountName}`);
    } else {
      toast.error('Invalid secret key');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    toast.error('Authentication failed. Please try again.');
  } finally {
    isAuthenticating.value = false;
  }
};

// Log out
const logout = () => {
  auth.value = {
    isAuthenticated: false,
    secretKey: '',
    accountName: ''
  };
  secretKey.value = '';

  if (import.meta.client) {
    localStorage.removeItem('secretKey');
    localStorage.removeItem('accountName');
  }

  toast.info('Logged out successfully');
};

// Handle file selection
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  addFiles(files);
  event.target.value = '';
};

// Handle drag and drop
const handleDrop = (event) => {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));

  if (files.length === 0) {
    toast.warning('Please drop image files only');
    return;
  }

  addFiles(files);
};

// Add files to selected files array
const addFiles = async (files) => {
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      toast.warning(`${file.name} is not an image`);
      continue;
    }

    const preview = URL.createObjectURL(file);
    const fileName = file.name;

    selectedFiles.value.push({
      file,
      preview,
      name: file.name,
      size: file.size,
      type: file.type,
      customName: fileName,
    });
  }
};

// Remove file from selected files
const removeFile = (index) => {
  URL.revokeObjectURL(selectedFiles.value[index].preview);
  selectedFiles.value.splice(index, 1);
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Upload files
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    toast.warning('Please select at least one image');
    return;
  }

  isUploading.value = true;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    for (const fileObj of selectedFiles.value) {
      // Compress image
      const compressedFile = fileObj.file
      // await imageCompression(fileObj.file, options);

      // Create form data
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('secretKey', secretKey.value);

      // Add custom name if provided
      if (fileObj.customName) {
        formData.append('customName', fileObj.customName);
      }

      // Upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Add to uploaded images
        // 判断是否已经存在
        const deletedImageIndex = uploadedImages.value.findIndex(image => image.url === result.url);
        if (deletedImageIndex !== -1) {
          uploadedImages.value.splice(deletedImageIndex, 1);
        }
        // 保留最新的
        uploadedImages.value.unshift({
          url: result.url,
          name: result.filename,
          uploadedAt: new Date().toISOString()
        });

        // Save to localStorage
        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages.value));

        toast.success(`Image uploaded successfully`);
      } else {
        toast.error(result.message || 'Upload failed');
      }
    }

    // Clear selected files
    selectedFiles.value.forEach(fileObj => {
      URL.revokeObjectURL(fileObj.preview);
    });
    selectedFiles.value = [];

  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Upload failed. Please try again.');
  } finally {
    isUploading.value = false;
  }
};

// Copy URL to clipboard
const copyToClipboard = (text) => {
  // 复制到剪贴板
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('URL copied to clipboard');
      })
      .catch((err) => {
        console.error('Clipboard error:', err);
        toast.error('Failed to copy URL');
      });
  } else {
    console.error('Clipboard API not supported');
    toast.error('Clipboard API not supported');
  }
};

// Get image name from URL
const getImageName = (url) => {
  return url.split('/').pop();
};

const removeImage = async (index) => {
  // 添加确认弹窗
  if (!confirm('确定要删除这张图片吗？此操作不可撤销。')) {
    return;
  }

  const fileObj = uploadedImages.value[index];
  // Create form data
  const formData = new FormData();
  formData.append('secretKey', secretKey.value);
  formData.append('customName', getImageName(fileObj.url));

  // Upload
  const response = await fetch('/api/upload', {
    method: 'DELETE',
    body: formData
  });

  const result = await response.json();

  if (result.success) {
    uploadedImages.value.splice(index, 1);
    // Save to localStorage
    localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages.value));
    toast.success(`Image removed successfully`);
  } else {
    toast.error(result.message || 'Remove failed');
  }

};

const wrapperUrl = (url) => {
  const u = new URL(url)
  // encodeURIComponent 中文
  return u.toString();
}

const openPreview = (url) => {
  window.open(wrapperUrl(url), '_blank');
}


</script>