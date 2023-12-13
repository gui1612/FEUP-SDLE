declare let self: ServiceWorkerGlobalScope

import localforage from 'localforage';
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing'

cleanupOutdatedCaches();

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

self.addEventListener("install", async (event) => {
    localforage.config({
        name: "SuperBasket",
        storeName: "SuperBasket",
    });
    
    event.waitUntil(
        localforage.setDriver(localforage.INDEXEDDB)
            .then(() => localforage.ready())
            .then(() => localforage.clear())
    );
});

self.skipWaiting();
clientsClaim();

//     console.log("install", event);

//     event.waitUntil(
//         caches.open('cache').then((cache) => {
//             // @ts-ignore
//             return cache.addAll(self.__WB_MANIFEST.map((item) => item.url));
//         })
//     );
// });


// self.addEventListener("fetch", (event) => {
//     console.log('fetch', event.request.url);

//     event.respondWith(
//         caches.match(event.request).then((cachedResponse) => {
//             return cachedResponse || fetch(event.request).then((response) => {
//                 // Cache the response for future use
//                 return caches.open('cache').then((cache) => {
//                     cache.put(event.request, response.clone());
//                     return response;
//                 });
//             });
//         })
//     );
// });
