export const SITE_URL = "https://iceinn.agneng.workers.dev/";
export const SITE_NAME = "ICEINN 愛似影攝影";
export const SITE_ALTERNATE_NAME = "ICEINN Photography";
export const SITE_DESCRIPTION = "ICEINN 愛似影攝影作品集：人物、活動、時尚、商品、空間與影像創作。";
export const SITE_EMAIL = "icegee@gmail.com";
export const SITE_TELEPHONE = "+886975348716";
export const SITE_SOCIAL_URLS = [
  "https://www.facebook.com/theiceinn/",
  "https://www.instagram.com/iceinn/",
  "https://www.flickr.com/photos/iceinn/",
];

/** @param {string} [path] */
export function siteUrl(path = "") {
  return new URL(path, SITE_URL).toString();
}

export const SITE_LOGO_URL = siteUrl("assets/images/logo-192.jpg");
export const SITE_OG_IMAGE_URL = siteUrl("og.jpg");
export const SITE_SITEMAP_URL = siteUrl("sitemap.xml");
export const SITE_IMAGE_SITEMAP_URL = siteUrl("image-sitemap.xml");

export const SEO_ROUTE_KEYS = /** @type {const} */ ([
  "home",
  "people",
  "event",
  "fashion",
  "product",
  "space",
  "video",
  "about",
]);

export const SEO_ROUTES = {
  home: {
    path: "/",
    title: "ICEINN 愛似影攝影｜Photography Portfolio",
    description: "ICEINN 愛似影攝影作品集：人物、活動、時尚、商品、空間與影像創作。",
  },
  people: {
    path: "/people",
    title: "人物 People｜ICEINN 愛似影攝影",
    description: "ICEINN 人物攝影作品：凝視、光線與城市邊緣。",
  },
  event: {
    path: "/event",
    title: "活動 Event｜ICEINN 愛似影攝影",
    description: "ICEINN 活動攝影作品：保存儀式與現場不可重演的情緒。",
  },
  fashion: {
    path: "/fashion",
    title: "時尚 Fashion｜ICEINN 愛似影攝影",
    description: "ICEINN 時尚攝影作品：服裝、身體與場域的編輯語言。",
  },
  product: {
    path: "/product",
    title: "商品 Product｜ICEINN 愛似影攝影",
    description: "ICEINN 商品攝影作品：質地、比例與品牌印象。",
  },
  space: {
    path: "/space",
    title: "空間 Space｜ICEINN 愛似影攝影",
    description: "ICEINN 空間攝影作品：建築、材質與人的尺度。",
  },
  video: {
    path: "/video",
    title: "影片 Video｜ICEINN 愛似影攝影",
    description: "《仙度瑞拉之時》：cinderellas by ICEINN Photography。",
  },
  about: {
    path: "/about",
    title: "關於 About｜ICEINN 愛似影攝影",
    description: "ICEINN 愛似影攝影的獲獎、展覽、攝影集與合作資訊。",
  },
};

/** @param {keyof typeof SEO_ROUTES} route */
export function routeUrl(route) {
  return siteUrl(SEO_ROUTES[route].path);
}

export const SITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "zh-Hant",
      publisher: { "@id": `${SITE_URL}#organization` },
    },
    {
      "@type": "Brand",
      "@id": `${SITE_URL}#brand`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
      sameAs: SITE_SOCIAL_URLS,
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
      image: SITE_OG_IMAGE_URL,
      description: SITE_DESCRIPTION,
      email: `mailto:${SITE_EMAIL}`,
      telephone: SITE_TELEPHONE,
      areaServed: { "@type": "Country", name: "Taiwan" },
      brand: { "@id": `${SITE_URL}#brand` },
      sameAs: SITE_SOCIAL_URLS,
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}#photography-service`,
      name: `${SITE_ALTERNATE_NAME} Services`,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      serviceType: ["人物攝影", "活動攝影", "時尚攝影", "商品攝影", "空間攝影"],
      areaServed: { "@type": "Country", name: "Taiwan" },
      provider: { "@id": `${SITE_URL}#organization` },
      brand: { "@id": `${SITE_URL}#brand` },
    },
  ],
};
