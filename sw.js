const CACHE = 'taipei-v5.4.0';
const ROOT = new URL('./',self.location.href);
const ASSETS = ['./','index.html','src/app.js','src/trip.js','src/state.js','src/styles.css','public/icon.svg','public/manifest.webmanifest'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('taipei-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET' || !ASSETS.includes(event.request.url))return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request)));
});
