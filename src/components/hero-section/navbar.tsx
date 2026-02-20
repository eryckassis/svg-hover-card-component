"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { default as GsapType } from "gsap";

const NAV_BRAND = "S—SKS";
const CTA_TEXT = "Get Started";
const CTA_HREF = "#";
const SCROLL_THRESHOLD = 50;

export function Navbar() {
  const brandRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lastScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);
  const gsapRef = useRef<typeof GsapType | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cancelled = false;
    let removeListener: (() => void) | null = null;

    async function init() {
      const { loadGsap } = await import("@/lib/gsap");
      const { gsap } = await loadGsap();

      if (cancelled) return;

      gsapRef.current = gsap;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const brand = brandRef.current;
        const cta = ctaRef.current;
        const g = gsapRef.current;

        if (!brand || !cta || !g) return;

        const delta = currentScrollY - lastScrollYRef.current;
        const targets = [brand, cta];

        if (
          delta > 0 &&
          currentScrollY > SCROLL_THRESHOLD &&
          !isHiddenRef.current
        ) {
          isHiddenRef.current = true;
          g.to(targets, {
            y: -60,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
        }

        if (delta < 0 && isHiddenRef.current) {
          isHiddenRef.current = false;
          g.to(targets, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }

        lastScrollYRef.current = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      removeListener = () => window.removeEventListener("scroll", handleScroll);
    }

    init();

    return () => {
      cancelled = true;
      removeListener?.();
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-120 py-10">
      <span
        ref={brandRef}
        className="text-sm font-bold tracking-tight will-change-transform"
      >
        {NAV_BRAND}
      </span>
      <Link
        ref={ctaRef}
        href={CTA_HREF}
        className="rounded-full bg-[#5e34ff] px-8 py-4.5 text-sm font-medium text-white transition-colors will-change-transform hover:bg-black"
      >
        {CTA_TEXT}
      </Link>
    </nav>
  );
}
