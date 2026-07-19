import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import {
  SITE_IMAGE_SITEMAP_URL,
  SITE_SITEMAP_URL,
  SITE_STRUCTURED_DATA,
  SITE_URL,
  SEO_ROUTE_KEYS,
  SEO_ROUTES,
  routeUrl,
  siteUrl,
} from "../seo.config.mjs";

const root = new URL("../", import.meta.url);
const legacyUrlPattern = /icegee1976\.github\.io\/iceinn/i;
const productionUrlPattern = new RegExp(SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

test("SEO source has one production-origin constant and generated public outputs", async () => {
  assert.equal(SITE_URL, "https://iceinn.agneng.workers.dev/");

  const [appFiles, publicFiles, robots, sitemap, staticIndex, seoConfig, generator] = await Promise.all([
    readdir(new URL("app/", root), { recursive: true }),
    readdir(new URL("public/", root), { recursive: true }),
    readFile(new URL("public/robots.txt", root), "utf8"),
    readFile(new URL("public/sitemap.xml", root), "utf8"),
    readFile(new URL("static/index.html", root), "utf8"),
    readFile(new URL("seo.config.mjs", root), "utf8"),
    readFile(new URL("scripts/generate-image-sitemap.mjs", root), "utf8"),
  ]);

  const generatedSeoFiles = new Set(["robots.txt", "sitemap.xml", "image-sitemap.xml"]);
  const appTextFiles = appFiles.filter((file) => /\.(?:ts|tsx)$/.test(file));
  const publicSourceFiles = publicFiles.filter((file) => {
    const normalized = file.replaceAll("\\", "/");
    return /\.(?:html|json|txt|xml)$/.test(normalized) && !generatedSeoFiles.has(normalized);
  });
  const appTexts = await Promise.all(
    appTextFiles.map((file) => readFile(new URL(`app/${file.replaceAll("\\", "/")}`, root), "utf8")),
  );
  const publicSourceTexts = await Promise.all(
    publicSourceFiles.map((file) => readFile(new URL(`public/${file.replaceAll("\\", "/")}`, root), "utf8")),
  );
  const nonGeneratedSource = [...appTexts, ...publicSourceTexts, staticIndex].join("\n");

  assert.match(seoConfig, /export const SITE_URL = "https:\/\/iceinn\.agneng\.workers\.dev\/"/);
  assert.match(generator, /from "\.\.\/seo\.config\.mjs"/);
  assert.doesNotMatch(generator, /from ["'][^"']+\.ts["']/);
  assert.doesNotMatch(nonGeneratedSource, productionUrlPattern);
  assert.doesNotMatch(`${nonGeneratedSource}\n${seoConfig}`, legacyUrlPattern);
  assert.match(staticIndex, /<link rel="canonical" href="__SITE_URL__"/);
  assert.match(robots, new RegExp(`Sitemap: ${SITE_SITEMAP_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  assert.match(robots, new RegExp(`Sitemap: ${SITE_IMAGE_SITEMAP_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(sitemapLocations, SEO_ROUTE_KEYS.map((route) => routeUrl(route)));
  assert.equal(new Set(Object.values(SEO_ROUTES).map((route) => route.title)).size, SEO_ROUTE_KEYS.length);
  assert.equal(new Set(Object.values(SEO_ROUTES).map((route) => route.description)).size, SEO_ROUTE_KEYS.length);
  assert.match(JSON.stringify(SITE_STRUCTURED_DATA), /"@type":"Organization"/);
  assert.match(JSON.stringify(SITE_STRUCTURED_DATA), /"@type":"Service"/);
  assert.doesNotMatch(JSON.stringify(SITE_STRUCTURED_DATA), /ProfessionalService/);
});

test("image sitemap contains every 1800px JPEG derivative", async () => {
  const [assetFiles, imageSitemap] = await Promise.all([
    readdir(new URL("public/assets/images/", root)),
    readFile(new URL("public/image-sitemap.xml", root), "utf8"),
  ]);
  const expectedUrls = assetFiles
    .filter((file) => /-1800\.jpg$/.test(file))
    .map((file) => siteUrl(`assets/images/${file}`))
    .sort();
  const actualUrls = [...imageSitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)]
    .map((match) => match[1])
    .sort();

  assert.equal(expectedUrls.length, 32);
  assert.deepEqual(actualUrls, expectedUrls);
  const landingPages = [...imageSitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(landingPages, ["home", "people", "event", "fashion", "product", "space"].map((route) => routeUrl(route)));
  for (const category of ["people", "event", "fashion", "product", "space"]) {
    assert.match(imageSitemap, new RegExp(`<loc>${routeUrl(category)}</loc>[\\s\\S]*?<image:loc>${siteUrl(`assets/images/${category}-01-1800.jpg`)}</image:loc>`));
  }
  assert.match(imageSitemap, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.doesNotMatch(imageSitemap, legacyUrlPattern);
});

test("migration map records every Wix route and the platform-limited canonical plan", async () => {
  const [map, readme] = await Promise.all([
    readFile(new URL("migration-url-map.json", root), "utf8").then(JSON.parse),
    readFile(new URL("README.md", root), "utf8"),
  ]);
  assert.equal(map.oldProperty, "https://icegee.wixsite.com/iceinn");
  assert.deepEqual(
    map.routes.map(({ oldUrl, newUrl }) => [oldUrl, newUrl]),
    [
      ["https://icegee.wixsite.com/iceinn", "https://iceinn.agneng.workers.dev/"],
      ["https://icegee.wixsite.com/iceinn/fashion", "https://iceinn.agneng.workers.dev/fashion"],
      ["https://icegee.wixsite.com/iceinn/photo-albums", "https://iceinn.agneng.workers.dev/"],
      ["https://icegee.wixsite.com/iceinn/people", "https://iceinn.agneng.workers.dev/people"],
      ["https://icegee.wixsite.com/iceinn/video", "https://iceinn.agneng.workers.dev/video"],
      ["https://icegee.wixsite.com/iceinn/copy-of-people", "https://iceinn.agneng.workers.dev/event"],
      ["https://icegee.wixsite.com/iceinn/about", "https://iceinn.agneng.workers.dev/about"],
      ["https://icegee.wixsite.com/iceinn/product", "https://iceinn.agneng.workers.dev/product"],
      ["https://icegee.wixsite.com/iceinn/space", "https://iceinn.agneng.workers.dev/space"],
    ],
  );
  assert.equal(map.status, "executed");
  assert.equal(map.executedAt, "2026-07-19");
  assert.match(map.executionNote, /all nine page-level external canonicals.*Wix editor.*published/i);
  assert.match(map.executionNote, /no page was set to noindex, unpublished, or deleted/i);
  assert.match(map.limitations.serverRedirects, /cannot create 301/i);
  assert.match(map.limitations.changeOfAddress, /does not support.*path/i);
  assert.match(readme, /external canonical/);
  assert.match(readme, /不要在送出 external canonical 的同時對舊頁加 `noindex`/);
  assert.match(readme, /不可執行或宣稱已執行 Change of Address/);
});
