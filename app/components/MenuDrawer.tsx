"use client";

import { useEffect, useRef } from "react";
import { navigation, type RouteKey } from "../data/portfolio";
import { isolatePageShell } from "./overlayA11y";

interface MenuDrawerProps {
  open: boolean;
  activeRoute: RouteKey | "not-found";
  hrefForRoute: (route: RouteKey) => string;
  onClose: () => void;
}

export function MenuDrawer({ open, activeRoute, hrefForRoute, onClose }: MenuDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    const restoreShell = isolatePageShell();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreShell();
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer-layer" role="presentation">
      <div className="drawer-backdrop" aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        className="drawer"
        id="site-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="網站導覽"
      >
        <div className="drawer-topline">
          <span className="eyebrow">Index / 目錄</span>
          <button ref={closeRef} className="icon-button close-button" onClick={onClose} aria-label="關閉選單">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="主要導覽">
          <ol className="drawer-nav">
            {navigation.map((item, index) => (
              <li key={item.route}>
                <a
                  href={hrefForRoute(item.route)}
                  aria-current={activeRoute === item.route ? "page" : undefined}
                  onClick={onClose}
                >
                  <span className="nav-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="nav-zh">{item.zh}</span>
                  <span className="nav-en">{item.en}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="drawer-contact">
          <a href="mailto:icegee@gmail.com">icegee@gmail.com</a>
          <a href="tel:+886975348716">+886 (0)975 348 716</a>
        </div>
      </div>
    </div>
  );
}
