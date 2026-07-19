import type { Metadata } from "next";
import "./globals.css";
import {
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_OG_IMAGE_URL,
  SITE_STRUCTURED_DATA,
  SITE_URL,
  SEO_ROUTES,
} from "../seo.config.mjs";

const homeSeo = SEO_ROUTES.home;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: homeSeo.title,
    template: "%s｜ICEINN 愛似影攝影",
  },
  description: homeSeo.description,
  keywords: ["ICEINN", "愛似影", "攝影", "人物攝影", "商品攝影", "空間攝影", "Taiwan photographer"],
  authors: [{ name: "ICEINN Photography" }],
  creator: "ICEINN Photography",
  alternates: { canonical: SITE_URL },
  icons: {
    icon: SITE_LOGO_URL,
    apple: SITE_LOGO_URL,
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: homeSeo.title,
    description: homeSeo.description,
    images: [{ url: SITE_OG_IMAGE_URL, width: 1200, height: 630, alt: "ICEINN 愛似影攝影作品集" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICEINN 愛似影攝影",
    description: "Photography portfolio by ICEINN, Taiwan.",
    images: [SITE_OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <head>
        <base href="/" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_STRUCTURED_DATA) }}
        />
        {children}
      </body>
    </html>
  );
}
