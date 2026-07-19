import type { MetadataRoute } from "next";
import { SITE_IMAGE_SITEMAP_URL, SITE_SITEMAP_URL } from "../seo.config.mjs";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: [SITE_SITEMAP_URL, SITE_IMAGE_SITEMAP_URL],
  };
}
