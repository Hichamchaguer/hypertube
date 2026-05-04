const CACHE_NAME = 'ht-v21';
const OFFLINE_URL = '/offline.html';

// 🚀 EMBEDDED FALLBACK HTML (Zero-Failure Guarantee)
const FALLBACK_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline — Hypertube</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0a0b10; color: #f5f5f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
    .glow { position: fixed; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(239,68,68,0.13) 0%, transparent 65%); pointer-events: none; }
    .scanlines { position: fixed; inset: 0; background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px); pointer-events: none; }
    h1 { font-size: clamp(3rem, 10vw, 4.5rem); letter-spacing: 0.04em; margin-bottom: 0.75rem; color: #ef4444; }
    p { font-size: 0.95rem; color: #6b7280; margin-bottom: 2rem; max-width: 400px; line-height: 1.6; }
    button { background: #ef4444; color: #fff; border: none; padding: 0.8rem 2.2rem; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .badge { position: fixed; top: 20px; left: 20px; background: rgba(239,68,68,0.15); color: #ef4444; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid rgba(239,68,68,0.3); }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="scanlines"></div>
  <div class="badge">HYPERTUBE OFFLINE</div>
  <div>
    <h1>NO SIGNAL</h1>
    <p>Looks like you're offline. Check your internet connection and try again — your content will be waiting for you.</p>
    <button onclick="location.reload()">Try Again</button>
  </div>
</body>
</html>
`;

self.addEventListener('install', (e) => {
  console.log('[SW] v21 Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(new Request(OFFLINE_URL, { cache: 'reload' })))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('[SW] v21 Activate');
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function provideFallback(request) {
  // 1. Try to find the exact or fuzzy match in cache
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;

  // 2. Otherwise return the embedded fallback HTML
  return new Response(FALLBACK_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(
        caches.match(event.request).then((cached) => {
          return cached || fetch(event.request).catch(() => new Response('', { status: 404 }));
        })
      );
    }
    return;
  }

  const isPageRequest = event.request.mode === 'navigate' || 
                        event.request.headers.get('accept')?.includes('text/html') ||
                        url.searchParams.has('_rsc') || 
                        event.request.headers.get('RSC');

  // 🔥 Pages & Next.js Data
  if (isPageRequest || !url.pathname.includes('.')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            return response;
          }
          // Handle 404s/Errors by showing fallback
          return provideFallback(event.request);
        })
        .catch(() => {
          // Handle Network Errors by showing fallback
          return provideFallback(event.request);
        })
    );
    return;
  }

  // 📦 Static Assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => new Response('offline', { status: 503 }));
    })
  );
});