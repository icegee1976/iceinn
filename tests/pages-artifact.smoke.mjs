import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("static artifact keeps base paths, hash recovery, and every derivative", async () => {
  const [index, notFound, source] = await Promise.all([
    readFile(new URL("dist-pages/index.html", root), "utf8"),
    readFile(new URL("dist-pages/404.html", root), "utf8"),
    readFile(new URL("migration-source.json", root), "utf8").then(JSON.parse),
  ]);

  assert.match(index, /(?:src|href)="\/iceinn\/assets\/index-[^"]+\.(?:js|css)"/);
  assert.match(index, /\/iceinn\/assets\/images\/home-01-960\.webp/);
  assert.match(index, /rel="preload"[^>]+fetchpriority="high"/);
  assert.match(notFound, /var base = "\/iceinn\/"/);
  assert.match(notFound, /"#\/"/);

  const ids = [
    ...source.home.map((_, index) => `home-${String(index + 1).padStart(2, "0")}`),
    ...Object.entries(source.categories).flatMap(([category, urls]) =>
      urls.map((_, index) => `${category}-${String(index + 1).padStart(2, "0")}`),
    ),
  ];
  assert.equal(ids.length, 32);

  await Promise.all(
    ids.flatMap((id) =>
      [960, 1800].flatMap((width) =>
        ["jpg", "webp"].map((extension) =>
          access(new URL(`dist-pages/assets/images/${id}-${width}.${extension}`, root)),
        ),
      ),
    ),
  );
});
