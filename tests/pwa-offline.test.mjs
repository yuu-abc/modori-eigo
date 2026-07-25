import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("registers an offline service worker", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /navigator\.serviceWorker\.register\("\/sw\.js"\)/);
  assert.match(page, /navigator\.serviceWorker\.ready/);
  assert.match(page, /postMessage\(\{ type: "CACHE_APP_SHELL" \}\)/);
});

test("provides an installable manifest and caches the app shell", async () => {
  const [manifestText, worker] = await Promise.all([
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.id, "/");
  assert.deepEqual(manifest.icons, [
    {
      src: "/app-icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "/app-icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ]);
  assert.match(worker, /cacheAppShell/);
  assert.match(worker, /Promise\.allSettled/);
  assert.match(worker, /event\.data\?\.type === "CACHE_APP_SHELL"/);
  assert.match(worker, /request\.mode === "navigate"/);
  assert.match(worker, /catch\(\(\) => caches\.match\("\/"\)\)/);
});

test("serves text-encoded PNG icons required for mobile installation", async () => {
  const [iconSource, workerSource] = await Promise.all([
    readFile(new URL("../worker/app-icons.ts", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  for (const size of [192, 512]) {
    const match = iconSource.match(new RegExp(`"/app-icon-${size}\\.png": "([A-Za-z0-9+/=]+)"`));
    assert.ok(match, `missing ${size}px icon`);
    const png = Buffer.from(match[1], "base64");
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }

  assert.match(workerSource, /appIconPngBase64\[url\.pathname\]/);
  assert.match(workerSource, /"content-type": "image\/png"/);
});
