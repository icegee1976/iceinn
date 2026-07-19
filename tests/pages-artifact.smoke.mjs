import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { SITE_OG_IMAGE_URL, SITE_URL } from "../seo.config.mjs";
import { routeHref, skipHref } from "../app/components/routing.mjs";

const root = new URL("../", import.meta.url);

test("static artifact keeps base paths, hash recovery, and every derivative", async () => {
  const [index, notFound, source, imageSitemap, staticEntry, portfolioSite] = await Promise.all([
    readFile(new URL("dist-pages/index.html", root), "utf8"),
    readFile(new URL("dist-pages/404.html", root), "utf8"),
    readFile(new URL("migration-source.json", root), "utf8").then(JSON.parse),
    readFile(new URL("dist-pages/image-sitemap.xml", root), "utf8"),
    readFile(new URL("static/entry.tsx", root), "utf8"),
    readFile(new URL("app/components/PortfolioSite.tsx", root), "utf8"),
  ]);

  assert.match(index, /(?:src|href)="\/iceinn\/assets\/index-[^"]+\.(?:js|css)"/);
  assert.match(index, /\/iceinn\/assets\/images\/home-01-960\.webp/);
  assert.match(index, /rel="preload"[^>]+fetchpriority="high"/);
  assert.match(index, /<base href="\/iceinn\/"\s*\/?>/);
  assert.match(index, new RegExp(`<link rel="canonical" href="${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  assert.match(index, new RegExp(`<meta property="og:url" content="${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  assert.match(index, new RegExp(`<meta property="og:image" content="${SITE_OG_IMAGE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  assert.match(index, new RegExp(`<meta name="twitter:image" content="${SITE_OG_IMAGE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  assert.match(index, /"@type":"WebSite"/);
  assert.match(index, /"@type":"Brand"/);
  assert.match(index, /"@type":"Organization"/);
  assert.match(index, /"@type":"Service"/);
  assert.doesNotMatch(index, /ProfessionalService|__SITE_/);
  assert.match(notFound, /var base = "\/iceinn\/"/);
  assert.match(notFound, /"#\/"/);
  assert.match(staticEntry, /routingMode="hash"/);
  assert.match(portfolioSite, /href=\{skipHref\(skipRoute, routingMode\)\}/);
  assert.match(portfolioSite, /event\.preventDefault\(\)[\s\S]*main-content[^\n]+focus\(\)/);
  assert.match(imageSitemap, /<loc>https:\/\/iceinn\.agneng\.workers\.dev\/<\/loc>/);
  assert.equal([...imageSitemap.matchAll(/<image:image>/g)].length, 32);

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

test("skip links preserve the current path or hash route before the focus handler runs", () => {
  assert.equal(routeHref("people", "path"), "/people");
  assert.equal(skipHref("people", "path"), "/people#main-content");
  assert.equal(
    new URL(skipHref("people", "path"), "https://iceinn.agneng.workers.dev/people").href,
    "https://iceinn.agneng.workers.dev/people#main-content",
  );

  assert.equal(routeHref("people", "hash"), "#/people");
  assert.equal(skipHref("people", "hash"), "#/people");
  assert.equal(
    new URL(skipHref("people", "hash"), "https://example.test/iceinn/#/people").href,
    "https://example.test/iceinn/#/people",
  );
  assert.notEqual(skipHref("people", "hash"), "#main-content");
});
