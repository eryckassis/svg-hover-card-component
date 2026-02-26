"use client";

import { useEffect, useRef } from "react";

// Per-section animation config: [rotation degrees, transformOrigin]
const SECTION_CONFIG: [number, string][] = [
  [-4, "bottom right"], // Section 1 (Links): tilts left, pivots bottom-right
  [3, "bottom left"], // Section 2 (Newsletter): tilts right, pivots bottom-left
  [-3, "bottom right"], // Section 3 (Labs): tilts left, pivots bottom-right
];

export function useMenuAnimation(
  panelRef: React.RefObject<HTMLDivElement | null>,
  isOpen: boolean,
) {
  const initRef = useRef(false);
  const gsapRef = useRef<typeof import("gsap").default | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Lazy-load GSAP once
      if (!gsapRef.current) {
        const { loadGsap } = await import("@/lib/gsap");
        const { gsap } = await loadGsap();
        gsapRef.current = gsap;
      }

      if (cancelled) return;

      const gsap = gsapRef.current;
      const panel = panelRef.current;
      if (!panel) return;

      const sections = Array.from(panel.children) as HTMLElement[];
      if (sections.length === 0) return;

      const stagger = 0.08;
      const duration = 0.55;
      const ease = "power2.out";

      // ── FIRST RENDER: set hidden state, no animation ──
      if (!initRef.current) {
        initRef.current = true;

        gsap.set(panel, { visibility: "hidden", opacity: 0 });

        const len = sections.length;
        for (let i = 0; i < len; i++) {
          const [rot, origin] = SECTION_CONFIG[i] ?? [-3, "bottom right"];
          gsap.set(sections[i], {
            opacity: 0,
            y: 60,
            rotate: rot,
            transformOrigin: origin,
          });
        }

        // Skip animating on mount
        if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
        }
      }

      isFirstRender.current = false;

      if (isOpen) {
        // ── ENTER: sections stagger in, each unrotating from its own angle ──
        gsap.set(panel, { visibility: "visible" });
        gsap.to(panel, { opacity: 1, duration: 0.25, ease, overwrite: true });

        const len = sections.length;
        for (let i = 0; i < len; i++) {
          const [rot, origin] = SECTION_CONFIG[i] ?? [-3, "bottom right"];

          // Ensure start state
          gsap.set(sections[i], {
            transformOrigin: origin,
          });

          gsap.fromTo(
            sections[i],
            { opacity: 0, y: 60, rotate: rot },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration,
              delay: i * stagger,
              ease,
              overwrite: true,
            },
          );
        }
      } else {
        // ── EXIT: reverse — sections stagger out, re-rotating to their angles ──
        const len = sections.length;
        const lastDelay = (len - 1) * stagger;

        // Sections exit in reverse order (bottom first)
        for (let i = len - 1; i >= 0; i--) {
          const [rot, origin] = SECTION_CONFIG[i] ?? [-3, "bottom right"];
          const reverseIndex = len - 1 - i;

          gsap.to(sections[i], {
            opacity: 0,
            y: 60,
            rotate: rot,
            duration: 0.4,
            delay: reverseIndex * stagger,
            ease: "power2.in",
            transformOrigin: origin,
            overwrite: true,
          });
        }

        // Hide panel after all sections have exited
        gsap.to(panel, {
          opacity: 0,
          duration: 0.2,
          delay: lastDelay + 0.25,
          ease: "power2.in",
          overwrite: true,
          onComplete: () => {
            gsap.set(panel, { visibility: "hidden" });
          },
        });
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [isOpen, panelRef]);
}
