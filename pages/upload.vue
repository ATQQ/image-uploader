<template>
  <div class="py-8 px-4 container mx-auto max-w-4xl">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-neutral-900 dark:text-gray-100">{{ t('auth.title') }}</h2>

      <div class="mb-6">
        <label for="secretKey" class="block mb-2 text-neutral-700 dark:text-gray-300">{{ t('auth.secretKey') }}</label>
        <div class="relative">
          <input v-if="!showPassword" id="secretKey" v-model="secretKey" type="password" class="input pr-10"
            :placeholder="t('auth.placeholder')" :disabled="isAuthenticated" />
          <input v-else id="secretKey" v-model="secretKey" type="text" class="input pr-10"
            :placeholder="t('auth.placeholder')" :disabled="isAuthenticated" />
          <button @click="showPassword = !showPassword" type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-200">
            <IconEye v-if="!showPassword" class="w-5 h-5" />
            <IconEyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div v-if="!isAuthenticated" class="flex justify-end">
        <button @click="authenticate" class="btn-primary" :disabled="isAuthenticating">
          <span v-if="isAuthenticating">{{ t('auth.authenticating') }}</span>
          <span v-else>{{ t('auth.authenticate') }}</span>
        </button>
      </div>

      <div v-else
        class="flex items-center justify-between p-3 bg-success-500 bg-opacity-10 text-success-500 rounded-lg">
        <div class="flex items-center gap-2">
          <IconCheck />
          <span>{{ t('auth.authenticated') }} <strong>{{ accountName }}</strong></span>
        </div>
        <button @click="logout" class="btn-secondary text-sm">{{ t('auth.logout') }}</button>
      </div>
    </div>

    <div v-if="isAuthenticated" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-neutral-900 dark:text-gray-100">{{ t('upload.title') }}</h2>

      <div
        class="border-2 border-dashed border-neutral-300 dark:border-gray-600 rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700"
        :class="{ 'border-primary-500 bg-primary-50 dark:bg-gray-700': isDragging }" @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileSelect" />
        <IconUpload class="w-12 h-12 mx-auto mb-4 text-neutral-500 dark:text-gray-400" />
        <p class="text-neutral-700 dark:text-gray-300 mb-2">{{ t('upload.dragDrop') }}</p>
        <p class="text-neutral-500 dark:text-gray-400 text-sm">{{ t('upload.clickBrowse') }}</p>
      </div>

      <div class="mb-4" v-if="selectedFiles.length > 0">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium text-neutral-900 dark:text-gray-100">{{ t('upload.selectedImages') }} ({{
            selectedFiles.length }})</h3>
          <button @click="selectedFiles = []" class="text-sm text-neutral-600 dark:text-gray-400 hover:text-error-500">
            {{ t('upload.clearAll') }}
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="(file, index) in selectedFiles" :key="index"
            class="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-gray-700 rounded-lg">
            <div class="w-12 h-12 rounded-lg bg-cover bg-center bg-neutral-200 dark:bg-gray-600 cursor-pointer"
              :style="{ backgroundImage: `url(${file.preview})` }" @click="openImagePreview(file.preview)"></div>
            <div class="flex-grow">
              <div class="flex items-center gap-2">
                <input v-model="file.customName" class="input text-sm py-1" :placeholder="t('upload.customFilename')" />
              </div>
              <div class="text-xs text-neutral-500 dark:text-gray-400 mt-1">
                {{ formatFileSize(file.size) }} | {{ file.type }}
              </div>
            </div>
            <button @click="removeFile(index)" class="text-neutral-500 dark:text-gray-400 hover:text-error-500">
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
          <span v-if="isUploading">{{ t('upload.uploading') }}</span>
          <span v-else>{{ t('upload.uploadButton') }} {{ selectedFiles.length }} {{ selectedFiles.length === 1 ?
            t('upload.image') : t('upload.images') }}</span>
        </button>
      </div>
    </div>

    <div v-if="isAuthenticated && uploadedImages.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-neutral-900 dark:text-gray-100">{{ t('uploaded.title') }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
        <div v-for="(image,idx) in uploadedImages" :key="idx"
          class="group relative bg-neutral-50 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div class="aspect-square bg-cover bg-center cursor-pointer" :style="{ backgroundImage: `url(${wrapperUrl(image.url)})` }"
            @click="openImagePreview(image.url)"></div>

          <div class="p-3">
            <div class="flex justify-between items-center mb-2">
              <div class="mb-2">
                <span class="text-sm font-medium text-neutral-900 dark:text-gray-100 block mb-2 break-all">{{
                  image.name }}</span>
              </div>
              <div class="flex items-center justify-end gap-1">
                <button @click="copyToClipboard(wrapperUrl(image.url))"
                  class="p-1 text-neutral-500 dark:text-gray-400 hover:text-primary-500" :title="t('uploaded.copyUrl')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button @click="openPreview(image.url)"
                  class="p-1 text-neutral-500 dark:text-gray-400 hover:text-primary-500" :title="t('uploaded.preview')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button @click="reuploadImage(idx)"
                  class="p-1 text-neutral-500 dark:text-gray-400 hover:text-primary-500"
                  :title="t('uploaded.reupload')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button @click="removeImage(idx)"
                  class="p-1 text-neutral-500 dark:text-gray-400 hover:text-error-500" :title="t('uploaded.delete')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-xs text-neutral-500 dark:text-gray-400">{{ t('uploaded.uploadedAt') }}: {{
              formatDate(image.uploadedAt) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加隐藏的文件输入框用于重新上传 -->
    <input ref="reuploadInput" type="file" accept="image/*" class="hidden" @change="handleReuploadSelect" />

    <!-- 图片预览组件 -->
    <ImagePreview :is-open="previewOpen" :image-url="previewImageUrl" @close="closeImagePreview" />
  </div>
</template>

<script setup>
import IconCopy from '@/components/icons/IconCopy.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconEye from '@/components/icons/icon-eye.vue';
import IconEyeOff from '@/components/icons/icon-eye-off.vue';
import IconUpload from '@/components/icons/IconUpload.vue';
import IconCheck from '@/components/icons/IconCheck.vue';
import ImagePreview from '@/components/ImagePreview.vue';
import LanguageThemeToggle from '@/components/LanguageThemeToggle.vue';
import { useToast } from "vue-toastification";

const { t } = useI18n()
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
const showPassword = ref(false);

// Upload state
const selectedFiles = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadedImages = ref([]);
const fileInput = ref(null);
const reuploadInput = ref(null);

const getUploadedImages = async () => {
  try {
    const response = await $fetch('/api/images/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${auth.value.secretKey}`
      }
    });

    if (response.success) {
      uploadedImages.value = response.images;
      // 更新本地存储
      localStorage.setItem('uploadedImages', JSON.stringify(response.images));
    }
  } catch (error) {
    console.error('获取图片列表失败:', error);
    toast.error('获取图片列表失败');
  }
}
// Load uploaded images and check authentication on client-side only
onMounted(async () => {
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

    // 如果已登录，获取用户图片
    if (auth.value.isAuthenticated) {
      getUploadedImages()
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
      getUploadedImages()
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

const removeImage = async (index) => {
  // 添加确认弹窗
  if (!confirm('确定要删除这张图片吗？此操作不可撤销。')) {
    return;
  }

  const fileObj = uploadedImages.value[index];
  // Create form data
  const formData = new FormData();
  formData.append('secretKey', secretKey.value);
  formData.append('customName', fileObj.name);

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

// 当前正在重新上传的图片索引
const reuploadingIndex = ref(-1);

// 图片预览状态
const previewOpen = ref(false);
const previewImageUrl = ref('');

// 打开图片预览
const openImagePreview = (url) => {
  previewImageUrl.value = wrapperUrl(url);
  previewOpen.value = true;
};

// 关闭图片预览
const closeImagePreview = () => {
  previewOpen.value = false;
};

// 触发重新上传文件选择
const reuploadImage = (index) => {
  reuploadingIndex.value = index;
  reuploadInput.value.click();
};

// 处理重新上传文件选择
const handleReuploadSelect = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) {
    reuploadingIndex.value = -1;
    return;
  }

  const file = files[0];
  if (!file.type.startsWith('image/')) {
    toast.warning(`${file.name} 不是图片文件`);
    reuploadingIndex.value = -1;
    event.target.value = '';
    return;
  }

  // 获取要覆盖的图片信息
  const imageToReplace = uploadedImages.value[reuploadingIndex.value];
  
  const imageName = imageToReplace.name;

  isUploading.value = true;

  try {
    // 创建表单数据
    const formData = new FormData();
    formData.append('image', file);
    formData.append('secretKey', secretKey.value);
    formData.append('customName', imageName);

    // 上传
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      const target = uploadedImages.value[reuploadingIndex.value]
      const newUrl = new URL(result.url)
      newUrl.searchParams.delete('t')
      newUrl.searchParams.set('t', new Date().getTime().toString())
      // 更新已上传图片列表
      Object.assign(target, {
        url: newUrl.toString(),
        name: result.filename,
        uploadedAt: new Date().toISOString()
      })
      // 保存到本地存储
      localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages.value));
      toast.success(`图片重新上传成功`);
    } else {
      toast.error(result.message || '重新上传失败');
    }
  } catch (error) {
    console.error('重新上传错误:', error);
    toast.error('重新上传失败，请重试');
  } finally {
    isUploading.value = false;
    reuploadingIndex.value = -1;
    event.target.value = '';
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleString()
}
</script>