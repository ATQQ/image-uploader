import { ref, computed } from 'vue';
// import imageCompression from 'browser-image-compression';

export function useImageUpload() {
  const selectedFiles = ref([]);
  const isUploading = ref(false);
  const uploadProgress = ref(0);
  
  // Add files to selected files array
  const addFiles = async (files) => {
    const newFiles = [];
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }
      
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type,
        customName: '',
      });
    }
    
    selectedFiles.value = [...selectedFiles.value, ...newFiles];
    return newFiles.length;
  };
  
  // Remove file from selected files
  const removeFile = (index) => {
    URL.revokeObjectURL(selectedFiles.value[index].preview);
    selectedFiles.value.splice(index, 1);
  };
  
  // Clear all selected files
  const clearFiles = () => {
    selectedFiles.value.forEach(fileObj => {
      URL.revokeObjectURL(fileObj.preview);
    });
    selectedFiles.value = [];
  };
  
  // Compress image
  // const compressImage = async (file, options = {}) => {
  //   const defaultOptions = {
  //     maxSizeMB: 1,
  //     maxWidthOrHeight: 1920,
  //     useWebWorker: true,
  //   };
    
  //   const compressOptions = { ...defaultOptions, ...options };
  //   return imageCompression(file, compressOptions);
  // };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return {
    selectedFiles,
    isUploading,
    uploadProgress,
    addFiles,
    removeFile,
    clearFiles,
    // compressImage,
    formatFileSize
  };
}