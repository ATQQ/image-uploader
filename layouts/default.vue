<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-neutral-200 bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-primary-500">
          <NuxtLink to="/" class="flex items-center gap-2">
            <IconUpload class="w-6 h-6" />
            <span>ImageUp</span>
          </NuxtLink>
        </h1>
        <nav>
          <ul class="flex space-x-4">
            <li>
              <NuxtLink to="/" class="text-neutral-700 hover:text-primary-500 transition-colors">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/upload" class="text-neutral-700 hover:text-primary-500 transition-colors">
                Upload
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <footer class="bg-neutral-100 border-t border-neutral-200 py-4">
      <div class="container mx-auto px-4 text-center text-neutral-600 text-sm">
        © {{ new Date().getFullYear() }} ImageUp - Secure Image Uploading
      </div>
    </footer>
  </div>
</template>