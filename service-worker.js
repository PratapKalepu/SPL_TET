
"use strict";

const CACHE_NAME = "ap-tet-practice-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./exam.html",
  "./manifest.json",

  "./css/styles.css",
  "./css/exam.css",

  "./js/app.js",
  "./js/storage.js",
  "./js/exam-engine.js",

  "./data/paper2a-maths.json",
  "./data/paper2a-telugu.json"
];

// Install: cache the app shell and question banks.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

// Activate: remove older versions of our app cache.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key =>
            key.startsWith("ap-tet-practice-") &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// Fetch: use cached files when available.
// For uncached same-origin GET requests, try the network first.
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(response => {
        if (
          response.ok &&
          response.type === "basic"
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      });
    })
  );
});