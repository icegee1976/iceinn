import type { PortfolioImage } from "../data/portfolio";

const assetRoot = "./assets/images";

export function imageUrl(id: string, width: 960 | 1800, extension: "jpg" | "webp") {
  return `${assetRoot}/${id}-${width}.${extension}`;
}

interface ResponsiveImageProps {
  image: PortfolioImage;
  className?: string;
  eager?: boolean;
  sizes?: string;
}

export function ResponsiveImage({
  image,
  className,
  eager = false,
  sizes = "(max-width: 760px) 100vw, 50vw",
}: ResponsiveImageProps) {
  const smallWidth = Math.min(image.width, 960);
  const largeWidth = Math.min(image.width, 1800);

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${imageUrl(image.id, 960, "webp")} ${smallWidth}w, ${imageUrl(image.id, 1800, "webp")} ${largeWidth}w`}
        sizes={sizes}
      />
      <img
        className={className}
        src={imageUrl(image.id, 960, "jpg")}
        srcSet={`${imageUrl(image.id, 960, "jpg")} ${smallWidth}w, ${imageUrl(image.id, 1800, "jpg")} ${largeWidth}w`}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? "sync" : "async"}
      />
    </picture>
  );
}
