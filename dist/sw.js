// registration --> installation --> activation
const staticCacheName = 'static-cache-v1.0';
const dynamicCacheName = 'dynamic-cache-v1.0';
const staticAssets = ['./', './index.html', './offline.html', './css/main.min.css', './css/header.min.css', './js/registerWorker.js', './js/common.js'];
self.addEventListener('install', async event => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(staticAssets);
  console.log('Service worker has been installed:', event);
});
self.addEventListener('activate', async event => {
  const cachesKeys = await caches.keys();
  const checkKeys = cachesKeys.map(async key => {
    if (staticCacheName !== key) {
      await caches.delete(key);
    }
  });
  await Promise.all(checkKeys);
  console.log('Service worker has been activated:', event);
});
self.addEventListener('fetch', async event => {
  console.log('Trying to fetch:', event.request.url);
  event.respondWith(checkCache(event.request));
});

async function checkCache(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
  const cache = await caches.open(dynamicCacheName);

  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedRes = await cache.match(req);

    if (cachedRes) {
      return cachedRes;
    } else if (req.url.includes('.html')) {
      return caches.match('./offline.html');
    } else {
      console.log('return caches.match(./images/no-image.jpg)');
    }
  }
}