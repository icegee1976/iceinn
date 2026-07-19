import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished portfolio shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="zh-Hant"/i);
  assert.match(html, /ICEINN 愛似影攝影/);
  assert.match(html, /<h1 class="sr-only" id="home-heading">光停留以前，先讓感受發生。<\/h1>/);
  assert.match(html, /<p class="hero-headline" aria-hidden="true"><span>光停留以前，<\/span><span>先讓感受發生。<\/span><\/p>/);
  assert.match(html, /<figure[^>]*id="selected-work"/);
  assert.doesNotMatch(html, /<div id="selected-work"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /<link rel="canonical" href="https:\/\/iceinn\.agneng\.workers\.dev\/"/);
  assert.match(html, /<meta property="og:url" content="https:\/\/iceinn\.agneng\.workers\.dev\/"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Brand"/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"Service"/);
  assert.doesNotMatch(html, /ProfessionalService/);
  assert.doesNotMatch(html, /icegee1976\.github\.io\/iceinn/i);
  assert.match(html, /aria-controls="site-navigation"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("portfolio manifest and local derivatives satisfy migration gates", async () => {
  const [portfolio, lightbox, source, appFiles, publicFiles] = await Promise.all([
    readFile(new URL("../app/data/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Lightbox.tsx", import.meta.url), "utf8"),
    readFile(new URL("../migration-source.json", import.meta.url), "utf8").then(JSON.parse),
    readdir(new URL("../app/", import.meta.url), { recursive: true }),
    readdir(new URL("../public/", import.meta.url), { recursive: true }),
  ]);

  assert.deepEqual(
    [source.home.length, ...["people", "event", "fashion", "product", "space"].map((key) => source.categories[key].length)],
    [5, 6, 6, 3, 8, 4],
  );
  assert.equal(source.about.awards.length, 10);
  assert.equal(source.about.exhibitions.length, 3);
  assert.equal(source.about.books.length, 1);
  assert.match(portfolio, /assertPortfolioManifest\(\)/);
  assert.match(portfolio, /must contain exactly 32 works/);
  assert.match(lightbox, /<span>Copyright @ 2026 iceinn<\/span>/);
  assert.match(lightbox, /alt=\{image\.alt\}/);

  const derivatives = publicFiles.filter((file) => /assets[\\/]images[\\/].+-(960|1800)\.(jpg|webp)$/.test(file));
  assert.equal(derivatives.length, 128);
  assert.ok(publicFiles.includes("assets\\images\\logo-192.webp") || publicFiles.includes("assets/images/logo-192.webp"));

  const shippedText = await Promise.all(
    [...appFiles.map((file) => `app/${file}`), ...publicFiles.filter((file) => /\.(html|json|txt)$/.test(file)).map((file) => `public/${file}`)]
      .filter((file) => !file.endsWith("asset-dimensions.json"))
      .map((file) => readFile(new URL(`../${file.replaceAll("\\", "/")}`, import.meta.url), "utf8").catch(() => "")),
  );
  assert.doesNotMatch(shippedText.join("\n"), /wixstatic\.com/i);
});
