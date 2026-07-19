import { readdir, writeFile } from "node:fs/promises";
import {
  SITE_IMAGE_SITEMAP_URL,
  SITE_SITEMAP_URL,
  SEO_ROUTE_KEYS,
  routeUrl,
  siteUrl,
} from "../seo.config.mjs";

const imageDirectory = new URL("../public/assets/images/", import.meta.url);
const publicDirectory = new URL("../public/", import.meta.url);
const imageFiles = (await readdir(imageDirectory))
  .filter((file) => /-1800\.jpg$/.test(file))
  .sort((left, right) => left.localeCompare(right));

const imageRoutes = new Map();
for (const file of imageFiles) {
  const category = file.split("-")[0];
  const route = category === "home" ? "home" : category;
  if (!SEO_ROUTE_KEYS.includes(route)) {
    throw new Error(`No SEO landing route configured for image: ${file}`);
  }
  const files = imageRoutes.get(route) ?? [];
  files.push(file);
  imageRoutes.set(route, files);
}

const imagePages = SEO_ROUTE_KEYS
  .filter((route) => imageRoutes.has(route))
  .map((route) => `  <url>
    <loc>${routeUrl(route)}</loc>
${imageRoutes.get(route).map((file) => `    <image:image>\n      <image:loc>${siteUrl(`assets/images/${file}`)}</image:loc>\n    </image:image>`).join("\n")}
  </url>`)
  .join("\n");

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imagePages}
</urlset>
`;

const sitemapEntries = SEO_ROUTE_KEYS
  .map((route) => `  <url>
    <loc>${routeUrl(route)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${route === "home" ? "1.0" : "0.8"}</priority>
  </url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
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
