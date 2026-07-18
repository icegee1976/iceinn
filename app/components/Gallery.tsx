"use client";

import { useState } from "react";
import type { PortfolioImage } from "../data/portfolio";
import { Lightbox } from "./Lightbox";
import { ResponsiveImage } from "./ResponsiveImage";

interface GalleryProps {
  images: readonly PortfolioImage[];
  eagerFirst?: boolean;
  variant?: "grid" | "home";
}

export function Gallery({ images, eagerFirst = false, variant = "grid" }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className={variant === "home" ? "home-gallery" : "gallery-grid"}>
        {images.map((image, index) => (
          <figure
            className="gallery-item"
            key={image.id}
            style={
              variant === "grid" || (variant === "home" && index > 0)
                ? { aspectRatio: `${image.width} / ${image.height}` }
                : undefined
            }
          >
            <button
              className="gallery-open"
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`放大檢視：${image.alt}`}
            >
              <ResponsiveImage
                image={image}
                eager={eagerFirst && index === 0}
                sizes={variant === "home" && index === 0 ? "100vw" : "(max-width: 760px) 100vw, 50vw"}
              />
              <span className="image-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          </figure>
        ))}
      </div>
      <Lightbox images={images} index={lightboxIndex} onChange={setLightboxIndex} />
    </>
  );
}
