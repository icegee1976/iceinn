import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioSite } from "../components/PortfolioSite";
import type { RouteKey } from "../data/portfolio";
import {
  SEO_ROUTES,
  SEO_ROUTE_KEYS,
  SITE_NAME,
  SITE_OG_IMAGE_URL,
  routeUrl,
} from "../../seo.config.mjs";

type ContentRoute = Exclude<RouteKey, "home">;

interface RoutePageProps {
  params: Promise<{ route: string }>;
}

function contentRoute(value: string): ContentRoute | null {
  return value !== "home" && (SEO_ROUTE_KEYS as readonly string[]).includes(value)
    ? (value as ContentRoute)
    : null;
}

export function generateStaticParams() {
  return Object.keys(SEO_ROUTES)
    .filter((route) => route !== "home")
    .map((route) => ({ route }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const route = contentRoute((await params).route);
  if (!route) notFound();

  const seo = SEO_ROUTES[route];
  const canonical = routeUrl(route);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName: SITE_NAME,
      title: seo.title,
      description: seo.description,
      url: canonical,
      images: [{ url: SITE_OG_IMAGE_URL, width: 1200, height: 630, alt: "ICEINN 愛似影攝影作品集" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [SITE_OG_IMAGE_URL],
    },
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const route = contentRoute((await params).route);
  if (!route) notFound();

  return <PortfolioSite initialRoute={route} routingMode="path" />;
}
