// Offline cache: app shell precached, libraries / fonts / map data cached at runtime.
const V='atc-v1',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // never cache live data / realtime
 if(/aviationweather|emqx|hivemq|mosquitto|peerjs/.test(u.host)&&!/\.js$/.test(u.pathname))return;
 const isShell=u.origin===location.origin&&(u.pathname.endsWith('/')||u.pathname.endsWith('index.html'));
 e.respondWith(isShell?fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  :caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok&&(u.origin===location.origin||/jsdelivr|unpkg|gstatic|googleapis/.test(u.host))){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x})))});
