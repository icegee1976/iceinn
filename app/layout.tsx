import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://icegee1976.github.io/iceinn/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ICEINN 愛似影攝影｜Photography Portfolio",
    template: "%s｜ICEINN 愛似影攝影",
  },
  description: "ICEINN 愛似影攝影作品集：人物、活動、時尚、商品、空間與影像創作。",
  keywords: ["ICEINN", "愛似影", "攝影", "人物攝影", "商品攝影", "空間攝影", "Taiwan photographer"],
  authors: [{ name: "ICEINN Photography" }],
  creator: "ICEINN Photography",
  alternates: { canonical: siteUrl },
  icons: {
    icon: `${siteUrl}assets/images/logo-192.jpg`,
    apple: `${siteUrl}assets/images/logo-192.jpg`,
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: siteUrl,
    siteName: "ICEINN 愛似影攝影",
    title: "ICEINN 愛似影攝影｜Photography Portfolio",
    description: "以光線與情緒，觀看人物、時尚、商品、空間與影像。",
    images: [{ url: `${siteUrl}og.jpg`, width: 1200, height: 630, alt: "ICEINN 愛似影攝影作品集" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICEINN 愛似影攝影",
    description: "Photography portfolio by ICEINN, Taiwan.",
    images: [`${siteUrl}og.jpg`],
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
