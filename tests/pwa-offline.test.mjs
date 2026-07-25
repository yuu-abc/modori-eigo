import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("registers an offline service worker", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /navigator\.serviceWorker\.register\("\/sw\.js"\)/);
});

test("provides an installable manifest and caches the app shell", async () => {
  const [manifestText, worker] = await Promise.all([
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "/");
  assert.deepEqual(manifest.icons, [
    {
      src: "/app-icon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any maskable",
    },
  ]);
  assert.match(worker, /cacheAppShell/);
  assert.match(worker, /request\.mode === "navigate"/);
  assert.match(worker, /catch\(\(\) => caches\.match\("\/"\)\)/);
});
