"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { PortfolioImage } from "../data/portfolio";
import { imageUrl } from "./ResponsiveImage";
import { isolatePageShell } from "./overlayA11y";

interface LightboxProps {
  images: readonly PortfolioImage[];
  index: number | null;
  onChange: (index: number | null) => void;
}

export function Lightbox({ images, index, onChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const indexRef = useRef(index);
  const open = index !== null;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

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
        onChange(null);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const current = indexRef.current ?? 0;
        onChange((current - 1 + images.length) % images.length);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const current = indexRef.current ?? 0;
        onChange((current + 1) % images.length);
      } else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
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
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreShell();
      returnFocusRef.current?.focus();
    };
  }, [images.length, onChange, open]);

  if (index === null) return null;
  const image = images[index];

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`作品檢視：${image.alt}`}
    >
      <button ref={closeRef} className="lightbox-close icon-button" onClick={() => onChange(null)} aria-label="關閉作品檢視">
        <span aria-hidden="true">×</span>
      </button>
      <button
        className="lightbox-nav lightbox-prev"
        onClick={() => onChange((index - 1 + images.length) % images.length)}
        aria-label="上一張作品"
      >
        <span aria-hidden="true">←</span>
      </button>
      <figure>
        <picture>
          <source srcSet={imageUrl(image.id, 1800, "webp")} type="image/webp" />
          <img
            src={imageUrl(image.id, 1800, "jpg")}
            width={image.width}
            height={image.height}
            alt={image.alt}
            decoding="async"
          />
        </picture>
        <figcaption>
          <span>{image.alt}</span>
          <span>{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        </figcaption>
      </figure>
      <button
        className="lightbox-nav lightbox-next"
        onClick={() => onChange((index + 1) % images.length)}
        aria-label="下一張作品"
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>,
    document.body,
  );
}
