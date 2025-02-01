/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

console.log('Server worker started');

self.addEventListener('install', _ => {
  console.log('Server worker installed');
  void self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activated');
  void event.waitUntil(self.clients.claim());
});

export {};
