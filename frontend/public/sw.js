const CACHE_NAME = 'ht-v22';
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
    body { font-family: system-ui, -apple-system, sans-serif; background: #0a0b10; color: #f5f5f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
    .glow { position: fixed; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(239,68,68,0.13) 0%, transparent 65%); pointer-events: none; }
    .scanlines { position: fixed; inset: 0; background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px); pointer-events: none; }
    .container { position: relative; z-index: 10; padding: 2rem; }
    h1 { font-size: clamp(3rem, 10vw, 4.5rem); letter-spacing: -0.02em; font-weight: 800; margin-bottom: 0.75rem; line-height: 1; }
    h1 span { color: #ef4444; }
    p { font-size: 1.1rem; color: #94a3b8; margin-bottom: 2.5rem; max-width: 400px; line-height: 1.6; font-weight: 400; }
    button { background: #ef4444; color: #fff; border: none; padding: 1rem 2.5rem; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 1rem; transition: all 0.2s; box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.4); }
    button:hover { background: #dc2626; transform: translateY(-2px); }
    .secondary-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); margin-top: 1rem; box-shadow: none; color: #94a3b8; }
    .secondary-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .badge { position: fixed; top: 30px; left: 30px; background: rgba(239,68,68,0.1); color: #ef4444; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; border: 1px solid rgba(239,68,68,0.2); letter-spacing: 0.1em; }
    .icon { width: 80px; height: 80px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: #ef4444; }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="scanlines"></div>
  <div class="badge">HYPERTUBE / SYSTEM OFFLINE</div>
  <div class="container">
    <div class="icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
    </div>
    <h1>NO <span>SIGNAL</span></h1>
    <p>The connection was lost. Hypertube is ready to stream as soon as you're back online.</p>
    <button onclick="location.reload()">RECONNECT NOW</button>
    <button onclick="location.href='/dashboard'" class="secondary-btn">GOTO DASHBOARD</button>
  </div>
</body>
</html>
`;

self.addEventListener('install', (e) => {
  console.log('[SW] v22 Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(new Request(OFFLINE_URL, { cache: 'reload' })))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('[SW] v22 Activate');
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function provideFallback(request) {
  // 1. Try fuzzy match in cache
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;

  // 2. Determine if it's an RSC request
  const isRSC = request.headers.get('RSC') || 
                new URL(request.url).searchParams.has('_rsc');

  // 3. Return the embedded fallback HTML (or JSON for RSC if needed)
  // For RSC, we should ideally return a minimal RSC payload that triggers an offline state
  // but for now, we return the HTML which Next.js might handle or fail gracefully
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

  // ⚡ AGGRESSIVE OFFLINE INTERCEPTION
  // If we are explicitly offline, don't even try to fetch from localhost
  if (!self.navigator.onLine && isPageRequest) {
    event.respondWith(provideFallback(event.request));
    return;
  }

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
          return provideFallback(event.request);
        })
        .catch(() => {
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