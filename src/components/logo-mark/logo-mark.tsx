"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { default as GsapType } from "gsap";
import type { LogoMarkProps } from "./type";

export function LogoMark({
  logos,
  speed = 50,
  fadeColor = "white",
}: LogoMarkProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<GsapType.core.Tween | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cancelled = false;

    async function init() {
      const { loadGsap } = await import("@/lib/gsap");
      const { gsap } = await loadGsap();

      if (cancelled) return;

      const track = trackRef.current;
      if (!track) return;

      const firstList = track.querySelector<HTMLElement>("[data-marquee-list]");
      if (!firstList) return;

      const listWidth = firstList.offsetWidth;
      const duration = listWidth / speed;

      gsap.set(track, { x: 0 });

      tweenRef.current = gsap.to(track, {
        x: -listWidth,
        duration,
        ease: "none",
        repeat: -1,
      });
    }

    init();

    return () => {
      cancelled = true;
      tweenRef.current?.kill();
    };
  }, [speed]);

  const logoItems = logos.map((logo, i) => (
    <div key={i} className="flex shrink-0 items-center justify-center px-8">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width ?? 120}
        height={logo.height ?? 40}
        className="h-6 w-auto object-contain opacity-50 grayscale"
      />
    </div>
  ));

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Fade esquerdo */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
        style={{
          background: `linear-gradient(to right, ${fadeColor}, transparent)`,
        }}
      />

      {/* Fade direito */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
        style={{
          background: `linear-gradient(to left, ${fadeColor}, transparent)`,
        }}
      />

      {/* Track */}
      <div ref={trackRef} className="flex w-max will-change-transform">
        {/* Lista original */}
        <div data-marquee-list className="flex shrink-0 items-center">
          {logoItems}
        </div>
        <div ref={trackRef} className="flex w-max will-change-transform">
          {/* Lista original */}
          <div data-marquee-list className="flex shrink-0 items-center">
            {logoItems}
          </div>

          {/* Clone 1 */}
          <div aria-hidden="true" className="flex shrink-0 items-center">
            {logoItems}
          </div>

          {/* Clone 2 — caso a lista seja menor que a viewport */}
          <div aria-hidden="true" className="flex shrink-0 items-center">
            {/* Clone para loop seamless */}
            <div aria-hidden="true" className="flex shrink-0 items-center">
              {logoItems}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
