declare let self: ServiceWorkerGlobalScope

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener("install", (event) => {
    console.log("install", event);

    event.waitUntil(
        caches.open('cache').then((cache) => {
            // @ts-ignore
            return cache.addAll(self.__WB_MANIFEST.map((item) => item.url));
        })
    );
});


self.addEventListener("fetch", (event) => {
    console.log('fetch', event.request.url);

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).then((response) => {
                // Cache the response for future use
                return caches.open('cache').then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
