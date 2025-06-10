<template>
  <section class="py-16 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 text-neutral-900">
          {{ t('title') }}
        </h1>
        <p class="text-xl text-neutral-700 max-w-2xl mx-auto">
          {{ t('common.tagline') }}
        </p>
      </div>
      
      <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex-1 max-w-md">
          <div class="text-primary-500 mb-4">
            <IconImage class="w-12 h-12" />
          </div>
          <h2 class="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">{{ t('home.quickSecure') }}</h2>
          <p class="text-neutral-700 dark:text-gray-300 mb-4">
            {{ t('home.securityDesc') }}
          </p>
          <NuxtLink :to="localePath('/upload')" class="btn-primary inline-block">
            {{ t('home.startUploading') }}
          </NuxtLink>
        </div>
      </div>
      
      <div class="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">{{ t('home.getStarted') }}</h2>
        <p class="mb-6 text-primary-100">
          {{ t('home.enterKey') }}
        </p>
        <NuxtLink :to="localePath('/upload')" class="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors">
          {{ t('home.goToUpload') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconImage from '~/components/icons/IconImage.vue';
const { t } = useI18n()
const localePath = useLocalePath();

</script>