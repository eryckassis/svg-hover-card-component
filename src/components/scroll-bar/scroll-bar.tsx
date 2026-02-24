"use client";

import { useEffect, useRef } from "react";
import type { ScrollBarProps } from "./types";

export function ScrollBar({ trackHeight = 160, width = 6 }: ScrollBarProps) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    const updateThumb = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) {
        thumb.style.opacity = "0";
        return;
      }

      const scrollRatio = scrollTop / docHeight;
      const thumbHeight = Math.max(
        trackHeight * 0.25,
        (window.innerHeight / document.documentElement.scrollHeight) *
          trackHeight,
      );
      const maxTravel = trackHeight - thumbHeight;
      const thumbTop = scrollRatio * maxTravel;

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${thumbTop}px)`;
      thumb.style.opacity = "1";
    };

    updateThumb();

    const onScroll = () => {
      requestAnimationFrame(updateThumb);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateThumb, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateThumb);
    };
  }, [trackHeight]);

  return (
    <div
      className="fixed right-4 top-1/2 z-50 -translate-y-1/2"
      style={{ height: trackHeight, width }}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="h-full w-full rounded-full bg-[#0000001a]"
      />
      {/* Thumb */}
      <div
        ref={thumbRef}
        className="absolute left-0 top-0 w-full rounded-full bg-black/80 transition-opacity duration-200"
        style={{ height: trackHeight * 0.25 }}
      />
    </div>
  );
}
