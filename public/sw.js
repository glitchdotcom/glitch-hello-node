/*
 * ServiceWorker to make site function as a PWA (Progressive Web App)
 *
 * Based on https://glitch.com/~pwa by https://glitch.com/@PaulKinlan
 */

// Specify what we want added to the cache for offline use
self.addEventListener("install", e => {
  e.waitUntil(
    // Give the cache a name
    caches.open("hello-node-pwa").then(cache => {
      // Add the homepage and stylesheet
      return cache.addAll(["/", "/style.css"]);
    })
  );
});

// Network falling back to cache approach - we only cache the home route
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
self.addEventListener("fetch", event => {
  event.respondWith(
    // Try fetching from network
    fetch(event.request).catch(() => {
      // Request failed - maybe we're offline - check cache
      caches.match(event.request).then(response => {
        // We have a cache match so return it
        if (response !== undefined) return response;

        // No cache match so return homepage as fallback
        return caches.match("/");
      });
    })
  );
});
