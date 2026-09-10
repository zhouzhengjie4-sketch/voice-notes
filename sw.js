'use strict';
// 修改页面或图标后，递增版本号。
const CACHE='suikouji-shell-v1';
const FILES=['./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('suikouji-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).catch(()=>caches.match('./index.html')));
 }else if(FILES.some(path=>new URL(path,self.registration.scope).href===req.url)){
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
 }
});
