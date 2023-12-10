declare let self: ServiceWorkerGlobalScope

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener("install", (event) => {
    console.log("insta332l2l", event);
});

self.addEventListener("fetch", (event) => {
    console.log("fetch", event.request.url)
    event.respondWith(fetch(event.request));
});


