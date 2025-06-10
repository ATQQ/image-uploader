// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    // '@pinia/nuxt',
  ],
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    vueI18n: path.resolve('./i18n.config.ts'),
    lazy: false,
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  css: [
    '~/assets/css/main.css',
  ],
  app: {
    head: {
      title: 'Image Uploader',
      meta: [
        { name: 'description', content: 'Upload and share your images securely' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },
  build: {
    transpile: ['vue-toastification'],
  }
})