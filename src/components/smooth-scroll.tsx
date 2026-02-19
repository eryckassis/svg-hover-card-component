"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let instance: { raf: (time: number) => void; destroy: () => void } | null =
      null;
    let rafId: number;

    async function init() {
      const { default: Lenis } = await import("lenis");

      instance = new Lenis();

      function raf(time: number) {
        instance?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    init();

    return () => {
      cancelAnimationFrame(rafId);
      instance?.destroy();
    };
  }, []);

  return null;
}
