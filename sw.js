"use strict";
const cacheName = "wordlight-3";
const assets = ["./","./index.html","./style.css","./featured.js","./lexicon.js","./chinese.js","./word-family-links.js","./word-families.js","./word-pictures.jpg","./WORDNET-LICENSE.txt","./app.js","./app.webmanifest","./icon-192.png","./icon-512.png","./ECDICT-LICENSE.txt"];
const allowed = new Set(assets.map(asset=>new URL(asset,self.location.href).href));
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(cacheName).then(cache=>cache.addAll(assets)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("wordlight-")&&key!==cacheName).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if (event.request.method!=="GET" || !allowed.has(event.request.url)) return;
  event.respondWith(caches.open(cacheName).then(async cache=>{
    const fallback = await cache.match(event.request);
    return fallback ?? fetch(event.request);
  }));
});
