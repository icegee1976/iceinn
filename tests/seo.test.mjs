import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import {
  SITE_IMAGE_SITEMAP_URL,
  SITE_SITEMAP_URL,
  SITE_STRUCTURED_DATA,
  SITE_URL,
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
  assert.match(sitemap, new RegExp(`<loc>${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>`));
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
  assert.match(imageSitemap, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.doesNotMatch(imageSitemap, legacyUrlPattern);
});
