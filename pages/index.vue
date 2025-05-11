<template>
  <section class="py-16 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 text-neutral-900">
          Secure Image Upload and Sharing
        </h1>
        <p class="text-xl text-neutral-700 max-w-2xl mx-auto">
          Upload your images securely with key-based authentication and get shareable links instantly.
        </p>
      </div>
      
      <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-lg flex-1 max-w-md">
          <div class="text-primary-500 mb-4">
            <IconImage class="w-12 h-12" />
          </div>
          <h2 class="text-2xl font-bold mb-3 text-neutral-900">Quick and Secure</h2>
          <p class="text-neutral-700 mb-4">
            Use your secret key to authenticate and upload images securely. Your data is always protected.
          </p>
          <NuxtLink to="/upload" class="btn-primary inline-block">
            Start Uploading
          </NuxtLink>
        </div>
        
        <!-- <div class="bg-white p-8 rounded-xl shadow-lg flex-1 max-w-md">
          <div class="text-primary-500 mb-4">
            <IconUpload class="w-12 h-12" />
          </div>
          <h2 class="text-2xl font-bold mb-3 text-neutral-900">Optimized Images</h2>
          <p class="text-neutral-700 mb-4">
            Images are automatically compressed before upload, saving bandwidth and storage while maintaining quality.
          </p>
          <NuxtLink to="/upload" class="btn-primary inline-block">
            Try It Now
          </NuxtLink>
        </div> -->
      </div>
      
      <div class="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p class="mb-6 text-primary-100">
          Enter your secret key and start uploading images right away.
        </p>
        <NuxtLink to="/upload" class="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors">
          Go to Upload Page
        </NuxtLink>
      </div>
    </div>
  </section>
</template>