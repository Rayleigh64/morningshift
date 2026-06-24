const CACHE = "morningshift-v2";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./favicon-32.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k!==CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if(e.request.method!=="GET") return;
  // index/HTMLはネット優先（更新を取りこぼさない）、その他はキャッシュ優先
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put("./index.html",c));return r;}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(x=>x.put(e.request,cp));return r;})));
});
