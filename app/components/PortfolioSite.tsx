"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  about,
  categories,
  categoryOrder,
  homeImages,
  type CategoryKey,
  type RouteKey,
} from "../data/portfolio";
import { Gallery } from "./Gallery";
import { MenuDrawer } from "./MenuDrawer";
import { ResponsiveImage } from "./ResponsiveImage";
import { SEO_ROUTES } from "../../seo.config.mjs";
import { routeHref, skipHref } from "./routing.mjs";

type CurrentRoute = RouteKey | "not-found";
export type RoutingMode = "path" | "hash";

function routeFromHash(hash: string): CurrentRoute {
  const route = hash.replace(/^#\/?/, "").replace(/\/$/, "") || "home";
  const routes: readonly string[] = ["home", ...categoryOrder, "video", "about"];
  return routes.includes(route) ? (route as RouteKey) : "not-found";
}

function Brand({ href }: { href: string }) {
  return (
    <a className="brand" href={href} aria-label="ICEINN 愛似影攝影—回到首頁">
      <img src="./assets/images/logo-192.webp" width="64" height="64" alt="" />
      <span className="brand-type">
        <strong>ICEINN 愛似影</strong>
        <span>Photography</span>
      </span>
    </a>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="eyebrow">Commission / 合作洽詢</span>
        <a className="footer-email" href="mailto:icegee@gmail.com">icegee@gmail.com</a>
        <a href="tel:+886975348716">+886 (0)975 348 716</a>
      </div>
      <div className="footer-social" aria-label="社群連結">
        <a href="https://www.instagram.com/iceinn/" target="_blank" rel="noreferrer">Instagram ↗</a>
        <a href="https://www.facebook.com/theiceinn/" target="_blank" rel="noreferrer">Facebook ↗</a>
        <a href="https://www.flickr.com/photos/iceinn/" target="_blank" rel="noreferrer">Flickr ↗</a>
      </div>
      <p>© {new Date().getFullYear()} ICEINN Photography</p>
    </footer>
  );
}

function HomePage({ hrefForRoute }: { hrefForRoute: (route: RouteKey) => string }) {
  const [previewCategory, setPreviewCategory] = useState<CategoryKey | null>(null);
  const showCategoryPreview = (key: CategoryKey) => {
    if (window.matchMedia("(min-width: 901px) and (hover: hover)").matches) {
      setPreviewCategory(key);
    }
  };

  return (
    <section className="home-page" aria-labelledby="home-heading">
      <h1 className="sr-only" id="home-heading">光停留以前，先讓感受發生。</h1>
      <div>
        <Gallery
          images={homeImages}
          eagerFirst
          variant="home"
          afterFirst={(
            <div className="hero-copy">
              <p className="hero-headline" aria-hidden="true">
                <span>光停留以前，</span>
                <span>先讓感受發生。</span>
              </p>
              <button
                className="scroll-cue"
                type="button"
                onClick={() =>
                  document.getElementById("selected-work")?.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                  })
                }
              >
                Selected works <span aria-hidden="true">↓</span>
              </button>
            </div>
          )}
        />
      </div>
      <section className="category-explorer" aria-label="作品分類索引">
        <nav className="category-index" aria-label="作品分類">
          <p className="eyebrow">Portfolio / 作品分類</p>
          {categoryOrder.map((key, index) => (
            <a
              key={key}
              href={hrefForRoute(key)}
              onMouseEnter={() => showCategoryPreview(key)}
              onMouseLeave={() => setPreviewCategory(null)}
              onFocus={() => showCategoryPreview(key)}
              onBlur={() => setPreviewCategory(null)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{categories[key].zh}</strong>
              <em>{categories[key].en}</em>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <aside className="category-preview" aria-hidden="true">
          {previewCategory ? (
            <div className="category-preview-image" key={previewCategory}>
              <ResponsiveImage
                image={categories[previewCategory].images[0]}
                sizes="(max-width: 900px) 0px, 38vw"
              />
              <span>{categories[previewCategory].en}</span>
            </div>
          ) : (
            <div className="category-preview-idle">
              <div className="category-preview-contact-sheet">
                {categoryOrder.map((key) => (
                  <div className="contact-sheet-image" key={key}>
                    <ResponsiveImage
                      image={categories[key].images[0]}
                      sizes="(max-width: 900px) 0px, 18vw"
                    />
                  </div>
                ))}
              </div>
              <div className="category-preview-idle-label">
                <span>ICEINN</span>
                <span>Living contact sheet</span>
              </div>
            </div>
          )}
        </aside>
      </section>
    </section>
  );
}

function CategoryPage({ route }: { route: (typeof categoryOrder)[number] }) {
  const category = categories[route];
  const pageNumber = categoryOrder.indexOf(route) + 1;
  return (
    <section className="portfolio-page" aria-labelledby={`${route}-heading`}>
      <header className="page-heading">
        <p className="eyebrow">Portfolio · {String(pageNumber).padStart(2, "0")}</p>
        <h1 id={`${route}-heading`}>
          <span className="heading-zh">{category.zh}</span>
          <span className="heading-en">{category.en}</span>
        </h1>
        <p>{category.statement}</p>
      </header>
      <Gallery images={category.images} />
    </section>
  );
}

function VideoPage() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="video-page" aria-labelledby="video-heading">
      <header className="page-heading">
        <p className="eyebrow">Moving image · 01</p>
        <h1 id="video-heading">
          <span className="heading-zh">影片</span>
          <span className="heading-en">Video</span>
        </h1>
      </header>
      <div className="video-frame">
        {playing ? (
          <iframe
            src="https://www.youtube-nocookie.com/embed/jmswQpa3j9g?autoplay=1&rel=0"
            title="《仙度瑞拉之時》：cinderellas by iceinn photography"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className="video-facade" type="button" onClick={() => setPlaying(true)} aria-label="播放《仙度瑞拉之時》影片">
            <img src="./assets/video-poster.jpg" width="1280" height="720" alt="《仙度瑞拉之時》影片封面" loading="lazy" decoding="async" />
            <span className="play-button" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      <div className="video-caption">
        <p>《仙度瑞拉之時》</p>
        <p>“cinderellas” by iceinn photography</p>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="about-page" aria-labelledby="about-heading">
      <header className="page-heading about-heading">
        <p className="eyebrow">Profile / Studio</p>
        <h1 id="about-heading">
          <span className="heading-zh">關於</span>
          <span className="heading-en">About</span>
        </h1>
        <p>ICEINN 愛似影，以人物、時尚、商品與空間攝影，探索光線和情緒之間的距離。</p>
      </header>
      <div className="about-records">
        <section>
          <h2><span>獲獎記錄</span>Awards</h2>
          <ol>{about.awards.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
        <section>
          <h2><span>展覽記錄</span>Exhibitions</h2>
          <ol>{about.exhibitions.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
        <section>
          <h2><span>攝影集</span>Books</h2>
          <ol>{about.books.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
      </div>
    </section>
  );
}

function NotFoundPage({ homeHref }: { homeHref: string }) {
  return (
    <section className="not-found" aria-labelledby="not-found-heading">
      <p className="eyebrow">404 / Page not found</p>
      <h1 id="not-found-heading">這一格，還沒有影像。</h1>
      <a href={homeHref}>返回首頁 →</a>
    </section>
  );
}

interface PortfolioSiteProps {
  initialRoute?: RouteKey;
  routingMode?: RoutingMode;
}

export function PortfolioSite({ initialRoute = "home", routingMode = "path" }: PortfolioSiteProps) {
  const [route, setRoute] = useState<CurrentRoute>(initialRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const focusFrameRef = useRef<number | null>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (routingMode !== "hash") return;

    const syncRoute = (moveFocus: boolean) => {
      const nextRoute = routeFromHash(window.location.hash);
      setRoute(nextRoute);
      const metadata = nextRoute === "not-found"
        ? { title: "找不到頁面｜ICEINN 愛似影攝影", description: "此頁面不存在，請返回 ICEINN 愛似影攝影首頁。" }
        : SEO_ROUTES[nextRoute];
      document.title = metadata.title;
      document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", metadata.description);
      window.scrollTo({ top: 0, behavior: "auto" });
      if (moveFocus) {
        if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
        focusFrameRef.current = requestAnimationFrame(() => {
          document.getElementById("main-content")?.focus();
          focusFrameRef.current = null;
        });
      }
    };
    syncRoute(false);
    const onHashChange = () => syncRoute(true);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
    };
  }, [routingMode]);

  const hrefForRoute = (target: RouteKey) => routeHref(target, routingMode);
  const skipRoute = route === "not-found" ? "home" : route;

  return (
    <>
      <a
        className="skip-link"
        href={skipHref(skipRoute, routingMode)}
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        跳到主要內容
      </a>
      <header className="site-header" id="site-shell-header">
        <Brand href={hrefForRoute("home")} />
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen(true)}
        >
          <span>Menu</span>
          <span className="menu-lines" aria-hidden="true"><i /><i /></span>
        </button>
      </header>
      <main id="main-content" tabIndex={-1}>
        {route === "home" && <HomePage hrefForRoute={hrefForRoute} />}
        {categoryOrder.includes(route as (typeof categoryOrder)[number]) && (
          <CategoryPage route={route as (typeof categoryOrder)[number]} />
        )}
        {route === "video" && <VideoPage />}
        {route === "about" && <AboutPage />}
        {route === "not-found" && <NotFoundPage homeHref={hrefForRoute("home")} />}
      </main>
      <div id="site-shell-footer"><SiteFooter /></div>
      <MenuDrawer
        open={menuOpen}
        activeRoute={route}
        hrefForRoute={hrefForRoute}
        onClose={closeMenu}
      />
    </>
  );
}
