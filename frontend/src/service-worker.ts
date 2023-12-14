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
