<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" @click="close">
    <div class="relative max-w-full max-h-full" @click.stop>
      <img :src="imageUrl" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl" />
      <button @click="close" class="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

// 监听ESC键关闭预览
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    close();
  }
};

// 关闭预览
const close = () => {
  emit('close');
};

// 添加和移除键盘事件监听器
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeyDown);
    // 禁止滚动
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeyDown);
    // 恢复滚动
    document.body.style.overflow = '';
  }
});

// 组件卸载时清理
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>