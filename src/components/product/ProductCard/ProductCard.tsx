import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../../features/products/types";
import { formatStorePrice } from "../../../features/products/utils/formatStorePrice";
import { useAppLocale } from "../../../hooks/useAppLocale";

type ProductCardProps = {
  product: Product;
};

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
    </svg>
  );
}

function formatRating(value: number, isFa: boolean): string {
  if (isFa) {
    return new Intl.NumberFormat("fa-IR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }
  return value.toFixed(1);
}

type ImageDotsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

function ImageDots({ count, activeIndex, onSelect }: ImageDotsProps) {
  return (
    <div
      className="flex items-center justify-center gap-1.5 rounded-full bg-black/35 px-2 py-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(index);
          }}
          className={[
            "rounded-full transition",
            index === activeIndex
              ? "h-2 w-2 bg-white"
              : "h-1.5 w-1.5 bg-white/50 hover:bg-white/80",
          ].join(" ")}
          aria-label={`Image ${index + 1}`}
          aria-current={index === activeIndex}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFa, textAlign } = useAppLocale();
  const images = product.images.length > 0 ? product.images : [""];
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasMultipleImages = images.length > 1;
  const currentImage = images[imageIndex] ?? images[0];
  const ratingLabel = formatRating(product.rating, isFa);

  const showPrev = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={[
        "group flex flex-col rounded-sm pb-[40px] transition-shadow duration-300",
        textAlign,
        "hover:shadow-md",
      ].join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            {isFa ? "بدون تصویر" : "No image"}
          </div>
        )}

        {hasMultipleImages && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
            <div className="pointer-events-auto">
              <ImageDots
                count={images.length}
                activeIndex={imageIndex}
                onSelect={setImageIndex}
              />
            </div>
          </div>
        )}

        {hasMultipleImages && isHovered && (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="absolute start-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-800 shadow-md transition hover:bg-white"
              aria-label={isFa ? "عکس قبلی" : "Previous image"}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute end-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-800 shadow-md transition hover:bg-white"
              aria-label={isFa ? "عکس بعدی" : "Next image"}
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="space-y-1 px-[40px] pt-[30px]">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="min-w-0 flex-1 truncate text-sm font-medium tracking-wide text-gray-900"
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="flex shrink-0 items-center gap-0.5 text-amber-500">
            {isFa ? (
              <>
                <span className="font-medium text-gray-800" dir="rtl">
                  {ratingLabel}
                </span>
                <StarIcon className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <StarIcon className="h-3.5 w-3.5" />
                <span className="font-medium text-gray-800" dir="ltr">
                  {ratingLabel}
                </span>
              </>
            )}
          </div>
        </div>

        <p className="truncate text-xs text-gray-500" title={product.brand}>
          {product.brand}
        </p>

        <p className="text-left text-sm font-medium text-gray-900">
          {formatStorePrice(product.price, isFa)}
        </p>
      </div>
    </Link>
  );
}
