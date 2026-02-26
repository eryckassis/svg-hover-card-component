"use client";

import { TwinText } from "@/components/twin-text";
import { useEffect, useRef } from "react";

const LINKS = [
  { label: "HOME", href: "/", active: true },
  { label: "ABOUT US", href: "/about", active: false },
  { label: "PROJECTS", href: "/projects", active: false },
  { label: "CONTACT", href: "/contact", active: false },
] as const;

// rendering-hoist-jsx: active dot hoisted
const activeDot = (
  <span className="relative z-10 h-2 w-2 rounded-full bg-neutral-900" />
);

// rendering-hoist-jsx: arrow SVG hoisted
const arrowIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3.515 12h16.97m0 0L13.01 4.525M20.485 12l-7.475 7.476"
    />
  </svg>
);

export function MenuLinks() {
  const navRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    // advanced-event-handler-refs: cleanup previous init (StrictMode safe)
    cleanupRef.current?.();
    cleanupRef.current = null;

    async function init() {
      const { loadGsap } = await import("@/lib/gsap");
      const { gsap } = await loadGsap();

      if (cancelled) return;

      const nav = navRef.current;
      if (!nav) return;

      const items = nav.querySelectorAll<HTMLAnchorElement>("[data-menu-link]");
      const cleanups: (() => void)[] = [];

      const len = items.length;
      for (let i = 0; i < len; i++) {
        const link = items[i];
        const bg = link.querySelector<HTMLSpanElement>("[data-link-bg]");
        const arrow = link.querySelector<HTMLSpanElement>("[data-link-arrow]");

        if (!bg || !arrow) continue;

        // Set initial state
        gsap.set(bg, { opacity: 0, scale: 0.85 });
        gsap.set(arrow, { opacity: 0, x: -8 });

        const onEnter = () => {
          // 1. Background appears
          gsap.to(bg, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          });

          // 2. Arrow appears with delay
          gsap.to(arrow, {
            opacity: 1,
            x: 0,
            duration: 0.35,
            delay: 0.12,
            ease: "power2.out",
            overwrite: true,
          });
        };

        const onLeave = () => {
          // 1. Arrow exits first
          gsap.to(arrow, {
            opacity: 0,
            x: -8,
            duration: 0.2,
            ease: "power2.in",
            overwrite: true,
          });

          // 2. Background exits after arrow
          gsap.to(bg, {
            opacity: 0,
            scale: 0.85,
            duration: 0.25,
            delay: 0.08,
            ease: "power2.in",
            overwrite: true,
          });
        };

        link.addEventListener("mouseenter", onEnter);
        link.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          link.removeEventListener("mouseenter", onEnter);
          link.removeEventListener("mouseleave", onLeave);
        });
      }

      // advanced-event-handler-refs: store cleanup in ref
      cleanupRef.current = () => {
        const cLen = cleanups.length;
        for (let i = 0; i < cLen; i++) {
          cleanups[i]();
        }
      };
    }

    init();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return (
    <div className="rounded-2xl bg-white p-8">
      <nav ref={navRef} className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            data-menu-link
            className="group relative flex items-center justify-between rounded-full pl-3 pr-6 py-3 font-aeonik text-[1.625em] font-normal tracking-wide text-neutral-900 uppercase"
          >
            {/* Background — animated with GSAP */}
            <span
              data-link-bg
              className="pointer-events-none absolute inset-y-0 -inset-x-5 rounded-full bg-[oklch(0.95_0.02_270)]"
              aria-hidden="true"
              style={{
                opacity: 0,
                transform: "scale(0.85)",
                willChange: "transform, opacity",
              }}
            />

            <TwinText text={link.label} hoverParent className="relative z-10" />

            {/* Arrow — animated with GSAP (delay after background) */}
            <span
              data-link-arrow
              className="relative z-10 flex items-center text-neutral-900 gap-6 "
              aria-hidden="true"
              style={{
                opacity: 0,
                transform: `translateX(-8px)`,
                willChange: "transform, opacity",
              }}
            >
              {arrowIcon}
            </span>

            {link.active ? activeDot : null}
          </a>
        ))}
      </nav>
    </div>
  );
}
