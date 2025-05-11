export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server
  if (process.server) return;
  
  // Skip middleware for non-protected routes
  if (to.path !== '/upload') return;
  
  // We'll still allow access but the page will show authentication UI
  return;
});