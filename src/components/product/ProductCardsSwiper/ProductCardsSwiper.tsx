import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useAppLocale } from "../../../hooks/useAppLocale";

type ProductCardsSwiperProps = {
  children: ReactNode[];
  slideClassName?: string;
};

export default function ProductCardsSwiper({
  children,
  slideClassName = "w-64 shrink-0 sm:w-72",
}: ProductCardsSwiperProps) {
  const { isFa } = useAppLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);

  const count = children.length;
  const showNav = count > 1;
  const maxIndex = Math.max(0, count - 1);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const firstSlide = viewport.querySelector<HTMLElement>("[data-swiper-slide]");
      setSlideWidth(firstSlide?.offsetWidth ?? viewport.offsetWidth);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [children.length]);

  useLayoutEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const goNext = () => {
    setIndex((current) => Math.min(current + 1, maxIndex));
  };

  const goPrev = () => {
    setIndex((current) => Math.max(current - 1, 0));
  };

  const prevLabel = isFa ? "محصول قبلی" : "Previous product";
  const nextLabel = isFa ? "محصول بعدی" : "Next product";

  if (count === 0) return null;

  return (
    <div className="relative w-full max-w-6xl px-12">
      <div ref={viewportRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * slideWidth}px)`,
          }}
        >
          {children.map((child, i) => (
            <div key={i} data-swiper-slide className={slideClassName}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {showNav ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="absolute start-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-800 shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={prevLabel}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={index === maxIndex}
            className="absolute end-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-800 shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={nextLabel}
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  );
}
