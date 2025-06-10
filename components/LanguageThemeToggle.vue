<template>
  <div class="flex items-center gap-4">
    <!-- 语言切换 -->
    <div class="relative">
      <select 
        v-model="currentLocale" 
        @change="changeLocale"
        class="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
          {{ locale.name }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>

    <!-- 主题切换 -->
    <div class="relative">
      <select 
        v-model="currentColorMode" 
        @change="changeColorMode"
        class="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="system">{{ t('common.system') }}</option>
        <option value="light">{{ t('common.light') }}</option>
        <option value="dark">{{ t('common.dark') }}</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
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

// 定义可用的语言选项
const availableLocales = computed(() => [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' }
])

// 初始化时设置语言
onMounted(() => {
  if (savedLocale && savedLocale !== locale.value) {
    setLocale(savedLocale)
  }
})

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