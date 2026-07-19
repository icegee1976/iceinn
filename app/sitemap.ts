import type { MetadataRoute } from "next";
import { SEO_ROUTE_KEYS, routeUrl } from "../seo.config.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_ROUTE_KEYS.map((route) => ({
      url: routeUrl(route),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "home" ? 1 : 0.8,
    }));
}
