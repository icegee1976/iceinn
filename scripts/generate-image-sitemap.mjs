import { readdir, writeFile } from "node:fs/promises";
import {
  SITE_IMAGE_SITEMAP_URL,
  SITE_SITEMAP_URL,
  SITE_URL,
  siteUrl,
} from "../seo.config.mjs";

const imageDirectory = new URL("../public/assets/images/", import.meta.url);
const publicDirectory = new URL("../public/", import.meta.url);
const imageFiles = (await readdir(imageDirectory))
  .filter((file) => /-1800\.jpg$/.test(file))
  .sort((left, right) => left.localeCompare(right));

const imageEntries = imageFiles
  .map((file) => `    <image:image>\n      <image:loc>${siteUrl(`assets/images/${file}`)}</image:loc>\n    </image:image>`)
  .join("\n");

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}</loc>
${imageEntries}
  </url>
</urlset>
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_SITEMAP_URL}
Sitemap: ${SITE_IMAGE_SITEMAP_URL}
`;

await Promise.all([
  writeFile(new URL("image-sitemap.xml", publicDirectory), imageSitemap, "utf8"),
  writeFile(new URL("sitemap.xml", publicDirectory), sitemap, "utf8"),
  writeFile(new URL("robots.txt", publicDirectory), robots, "utf8"),
]);
console.log(`Generated robots and sitemaps with ${imageFiles.length} images.`);
