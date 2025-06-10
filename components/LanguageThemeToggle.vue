<template>
  <div class="flex items-center">
    <!-- 语言切换 -->
    <div class="relative group">
      <div 
        @click="showLocaleDropdown = !showLocaleDropdown"
        class="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-400 rounded-lg px-3 py-2 text-sm cursor-pointer transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <span v-if="currentLocale === 'en'" class="text-lg">🇺🇸</span>
        <span v-else-if="currentLocale === 'zh'" class="text-lg">🇨🇳</span>
        <span class="font-medium text-neutral-800 dark:text-gray-200">{{ getLocaleName(currentLocale) }}</span>
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showLocaleDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      <!-- 下拉菜单 -->
      <div 
        v-if="showLocaleDropdown" 
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-in-out origin-top transform scale-100 opacity-100"
      >
        <div 
          v-for="locale in availableLocales" 
          :key="locale.code" 
          @click="selectLocale(locale.code)" 
          class="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
          :class="{ 'bg-gray-50 dark:bg-gray-750': currentLocale === locale.code }"
        >
          <span class="text-lg">{{ locale.code === 'en' ? '🇺🇸' : '🇨🇳' }}</span>
          <span class="font-medium text-neutral-800 dark:text-gray-200 whitespace-nowrap">{{ locale.name }}</span>
          <svg v-if="currentLocale === locale.code" class="w-4 h-4 ml-auto text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 主题切换 -->
    <div class="relative group">
      <div 
        @click="showThemeDropdown = !showThemeDropdown"
        class="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-400 rounded-lg px-3 py-2 text-sm cursor-pointer transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <span class="text-lg">
          <span v-if="currentColorMode === 'system'">⚙️</span>
          <span v-else-if="currentColorMode === 'light'">☀️</span>
          <span v-else-if="currentColorMode === 'dark'">🌙</span>
        </span>
        <span class="font-medium text-neutral-800 dark:text-gray-200">
          {{ t(`common.${currentColorMode}`) }}
        </span>
        <!-- <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showThemeDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg> -->
      </div>
      
      <!-- 下拉菜单 -->
      <div 
        v-if="showThemeDropdown" 
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-in-out origin-top transform scale-100 opacity-100"
      >
        <div 
          v-for="mode in ['system', 'light', 'dark']" 
          :key="mode" 
          @click="selectTheme(mode)" 
          class="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
          :class="{ 'bg-gray-50 dark:bg-gray-750': currentColorMode === mode }"
        >
          <span class="text-lg">
            <span v-if="mode === 'system'">⚙️</span>
            <span v-else-if="mode === 'light'">☀️</span>
            <span v-else-if="mode === 'dark'">🌙</span>
          </span>
          <span class="font-medium text-neutral-800 dark:text-gray-200">{{ t(`common.${mode}`) }}</span>
          <svg v-if="currentColorMode === mode" class="w-4 h-4 ml-auto text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale, locales, setLocale, t } = useI18n()
const colorMode = useColorMode()

// 从localStorage中获取保存的语言设置，如果没有则使用当前语言
const savedLocale = process.client ? localStorage.getItem('user-locale') : null
const currentLocale = ref(savedLocale || locale.value)
const currentColorMode = ref(colorMode.preference)

// 下拉菜单状态
const showLocaleDropdown = ref(false)
const showThemeDropdown = ref(false)

// 定义可用的语言选项
const availableLocales = computed(() => [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' }
])

// 获取语言名称
const getLocaleName = (code) => {
  const locale = availableLocales.value.find(l => l.code === code)
  return locale ? locale.name : code
}

// 初始化时设置语言
onMounted(() => {
  if (savedLocale && savedLocale !== locale.value) {
    setLocale(savedLocale)
  }
  
  // 点击外部关闭下拉菜单
  document.addEventListener('click', (event) => {
    const target = event.target
    if (!target.closest('.group')) {
      showLocaleDropdown.value = false
      showThemeDropdown.value = false
    }
  })
})

// 选择语言
const selectLocale = async (code) => {
  currentLocale.value = code
  // 保存语言设置到localStorage
  if (process.client) {
    localStorage.setItem('user-locale', code)
  }
  await setLocale(code)
  showLocaleDropdown.value = false
}

// 选择主题
const selectTheme = (mode) => {
  currentColorMode.value = mode
  colorMode.preference = mode
  showThemeDropdown.value = false
}

const changeLocale = async () => {
  // 保存语言设置到localStorage
  if (process.client) {
    localStorage.setItem('user-locale', currentLocale.value)
  }
  await setLocale(currentLocale.value)
}

const changeColorMode = () => {
  colorMode.preference = currentColorMode.value
}

// 监听颜色模式变化
watch(() => colorMode.preference, (newMode) => {
  currentColorMode.value = newMode
})

// 监听语言变化
watch(() => locale.value, (newLocale) => {
  currentLocale.value = newLocale
  // 同步更新localStorage
  if (process.client) {
    localStorage.setItem('user-locale', newLocale)
  }
})
</script>

<style scoped>
/* 添加过渡动画 */
.transform {
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>