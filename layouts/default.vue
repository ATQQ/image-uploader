<template>
  <div class="min-h-screen flex flex-col bg-neutral-50 dark:bg-gray-900">
    
    <header class="border-b border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Logo 区域 -->
        <div class="flex items-center">
          <NuxtLink :to="localePath('/')" class="flex items-center gap-3 group">
            <div class="p-2 bg-primary-500 rounded-lg group-hover:bg-primary-600 transition-colors">
              <IconUpload class="w-5 h-5 text-white" />
            </div>
            <div class="flex flex-col">
              <span class="text-lg font-bold text-neutral-900 dark:text-white">ImageUp</span>
              <span class="text-xs text-neutral-500 dark:text-gray-400">{{ t('common.tagline') }}</span>
            </div>
          </NuxtLink>
        </div>

        <!-- 中间导航 -->
        <nav class="hidden md:block">
          <ul class="flex space-x-6">
            <li>
              <NuxtLink :to="localePath('/')" class="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                {{ t('nav.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/upload')" class="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                {{ t('nav.upload') }}
              </NuxtLink>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/ATQQ/image-uploader/tree/main" class="text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <!-- 右侧控制区域 -->
        <div class="flex items-center gap-3">
          <!-- 语言和主题切换组件 -->
          <LanguageThemeToggle />
          
          <!-- 移动端菜单按钮 -->
          <button @click="toggleMobileMenu" class="md:hidden p-2 text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <nav class="px-4 py-3">
          <ul class="space-y-2">
            <li>
              <NuxtLink @click="closeMobileMenu" :to="localePath('/')" class="block py-2 text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                {{ t('nav.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink @click="closeMobileMenu" :to="localePath('/upload')" class="block py-2 text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                {{ t('nav.upload') }}
              </NuxtLink>
            </li>
            <li>
              <a @click="closeMobileMenu" target="_blank" rel="noopener noreferrer" href="https://github.com/ATQQ/image-uploader/tree/main" class="block py-2 text-neutral-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <footer class="bg-neutral-100 dark:bg-gray-800 border-t border-neutral-200 dark:border-gray-700 py-6">
      <div class="container mx-auto px-4 text-center text-neutral-600 dark:text-gray-400 text-sm">
        © {{ new Date().getFullYear() }} ImageUp - {{ t('common.footer') }}
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import IconUpload from '@/components/icons/IconUpload.vue';
import LanguageThemeToggle from '@/components/LanguageThemeToggle.vue';

const { t } = useI18n();
const localePath = useLocalePath();

// 移动端菜单状态
const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

// 点击外部关闭移动端菜单
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element;
    if (!target.closest('header') && showMobileMenu.value) {
      showMobileMenu.value = false;
    }
  };
  
  document.addEventListener('click', handleClickOutside);
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>