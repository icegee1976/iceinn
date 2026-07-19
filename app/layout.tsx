import type { Metadata } from "next";
import "./globals.css";
import {
  SITE_DESCRIPTION,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_OG_IMAGE_URL,
  SITE_URL,
} from "../seo.config.mjs";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ICEINN 愛似影攝影｜Photography Portfolio",
    template: "%s｜ICEINN 愛似影攝影",
  },
  description: SITE_DESCRIPTION,
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
    title: "ICEINN 愛似影攝影｜Photography Portfolio",
    description: "以光線與情緒，觀看人物、時尚、商品、空間與影像。",
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
      <body>{children}</body>
    </html>
  );
}
