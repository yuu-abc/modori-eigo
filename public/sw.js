
const SHELL_URLS = [
  "/",
  "/manifest.webmanifest",
  "/app-icon.svg",

];

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const pageResponse = await fetch("/", { cache: "reload" });

  if (!pageResponse.ok) {
    throw new Error("Could not cache the app shell");
  }

  const html = await pageResponse.clone().text();
  await cache.put("/", pageResponse);

  const assetUrls = new Set(SHELL_URLS.slice(1));
  for (const match of html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)) {
    assetUrls.add(match[1]);
  }
  for (const match of html.matchAll(/import\(["'](\/assets\/[^"']+)["']\)/g)) {
    assetUrls.add(match[1]);
  }


}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});


self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname === "/sw.js") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put("/", response.clone());
          }
          return response;
        })
        .catch(() => caches.match("/")),
    );
    return;
  }

  if (url.pathname.startsWith("/assets/") || SHELL_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then(async (response) => {
            if (response.ok) {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, response.clone());
            }
            return response;
          }),
      ),
    );
  }
});
