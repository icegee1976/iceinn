"""Create responsive, local web derivatives from the migration originals."""

from __future__ import annotations

import json
import tempfile
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "assets" / "images"
WIDTHS = (960, 1800)


def save_variant(image: Image.Image, stem: str, width: int) -> None:
    ratio = min(1.0, width / image.width)
    size = (round(image.width * ratio), round(image.height * ratio))
    resized = image if size == image.size else image.resize(size, Image.Resampling.LANCZOS)
    resized.save(OUTPUT / f"{stem}-{width}.webp", "WEBP", quality=82, method=6)
    resized.save(
        OUTPUT / f"{stem}-{width}.jpg",
        "JPEG",
        quality=84,
        optimize=True,
        progressive=True,
    )


def source_items() -> list[tuple[str, str]]:
    source = json.loads((ROOT / "migration-source.json").read_text(encoding="utf-8"))
    items = [("logo", source["logo"])]
    items.extend((f"home-{index:02d}", url) for index, url in enumerate(source["home"], 1))
    for category in ("people", "event", "fashion", "product", "space"):
        items.extend(
            (f"{category}-{index:02d}", url)
            for index, url in enumerate(source["categories"][category], 1)
        )
    return items


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    dimensions: dict[str, dict[str, int]] = {}

    with tempfile.TemporaryDirectory(prefix="iceinn-assets-") as temporary:
        source_dir = Path(temporary)
        for stem, url in source_items():
            path = source_dir / f"{stem}.jpg"
            urllib.request.urlretrieve(url, path)
            with Image.open(path) as source:
                image = ImageOps.exif_transpose(source).convert("RGB")
                dimensions[stem] = {"width": image.width, "height": image.height}
                if stem == "logo":
                    logo = image.resize((192, 192), Image.Resampling.LANCZOS)
                    logo.save(OUTPUT / "logo-192.webp", "WEBP", quality=88, method=6)
                    logo.save(
                        OUTPUT / "logo-192.jpg",
                        "JPEG",
                        quality=88,
                        optimize=True,
                        progressive=True,
                    )
                    continue

                for width in WIDTHS:
                    save_variant(image, stem, width)

    (OUTPUT / "asset-dimensions.json").write_text(
        json.dumps(dimensions, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
