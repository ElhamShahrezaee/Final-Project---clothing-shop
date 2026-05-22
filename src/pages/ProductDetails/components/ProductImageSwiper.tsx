import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAppLocale } from "../../../hooks/useAppLocale";

const TRANSITION_MS = 600;

type ProductImageSwiperProps = {
  images: string[];
  alt: string;
};

type SwiperNavProps = {
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
};

function SwiperNav({ onPrev, onNext, prevLabel, nextLabel }: SwiperNavProps) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        className="absolute start-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-800 shadow-md transition hover:bg-white"
        aria-label={prevLabel}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute end-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-800 shadow-md transition hover:bg-white"
        aria-label={nextLabel}
      >
        ›
      </button>
    </>
  );
}

export default function ProductImageSwiper({ images, alt }: ProductImageSwiperProps) {
  const { isFa } = useAppLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [slideWidth, setSlideWidth] = useState(0);

  const prevLabel = isFa ? "عکس قبلی" : "Previous image";
  const nextLabel = isFa ? "عکس بعدی" : "Next image";

  const slides = useMemo(
    () => (images.length > 1 ? [...images, images[0]] : images),
    [images],
  );

  const count = images.length;
  const showNav = count > 1;

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => setSlideWidth(viewport.offsetWidth);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    setIndex(0);
    setAnimate(true);
  }, [images]);

  const jumpTo = (nextIndex: number, withAnimation: boolean) => {
    setAnimate(withAnimation);
    setIndex(nextIndex);
  };

  const handleTransitionEnd = () => {
    if (count > 1 && index === count) {
      jumpTo(0, false);
    }
  };

  const goNext = () => {
    if (!showNav) return;
    setAnimate(true);
    setIndex((current) => current + 1);
  };

  const goPrev = () => {
    if (!showNav) return;

    if (index === 0) {
      jumpTo(count, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
          setIndex(count - 1);
        });
      });
      return;
    }

    setAnimate(true);
    setIndex((current) => current - 1);
  };

  if (count === 0) {
    return (
      <section
        dir="ltr"
        className="relative w-full border-b bg-gray-50"
      >
        <div className="flex h-[50vh] min-h-[280px] w-full items-center justify-center text-sm text-gray-400 md:h-[60vh]">
          {isFa ? "بدون تصویر" : "No image"}
        </div>
      </section>
    );
  }

  return (
    <section dir="ltr" className="relative w-full border-b bg-gray-50">
      <div
        ref={viewportRef}
        className="relative h-[50vh] min-h-[280px] w-full overflow-hidden md:h-[60vh]"
      >
        <div
          className="flex h-full will-change-transform"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${index * slideWidth}px)`,
            transition: animate
              ? `transform ${TRANSITION_MS}ms ease-in-out`
              : "none",
          }}
        >
          {slides.map((src, slideIndex) => (
            <div
              key={`${src}-${slideIndex}`}
              className="flex h-full shrink-0 grow-0 items-center justify-center px-4"
              style={{ width: slideWidth > 0 ? slideWidth : "100%" }}
            >
              <img
                src={src}
                alt={`${alt} ${(slideIndex % count) + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {showNav && (
          <SwiperNav
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}

        {showNav && (
          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5">
            {images.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => {
                  setAnimate(true);
                  setIndex(dotIndex);
                }}
                className={[
                  "rounded-full transition",
                  dotIndex === index % count
                    ? "h-2 w-2 bg-gray-900"
                    : "h-1.5 w-1.5 bg-gray-400 hover:bg-gray-600",
                ].join(" ")}
                aria-label={
                  isFa ? `عکس ${dotIndex + 1}` : `Image ${dotIndex + 1}`
                }
                aria-current={dotIndex === index % count}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
