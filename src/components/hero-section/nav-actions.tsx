"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { default as GsapType } from "gsap";
import { MenuPanel } from "./menu-panel";

const TALK_TEXT = "LET'S TALK";
const MENU_TEXT = "MENU";
const CLOSE_TEXT = "CLOSE";

// rendering-hoist-jsx: arrow SVG path hoisted
const ARROW_PATH = "M2.343 8h11.314m0 0-4.984 4.984M13.657 8 8.673 3.016";

// Line states — viewBox 0 0 24 24, centered at y=12
const LINE_FLAT = "M2 12 Q4 12, 6 12 T10 12 T14 12 T18 12 T22 12";

// Wave phases for continuous loop (Lusion style)
const WAVE_PATHS = [
  "M2 12 Q4 8, 6 12 T10 12 T14 12 T18 12 T22 12",
  "M2 12 Q4 12, 6 8 T10 16 T14 8 T18 16 T22 12",
  "M2 12 Q4 16, 6 12 T10 8 T14 16 T18 8 T22 12",
  "M2 12 Q4 12, 6 16 T10 8 T14 16 T18 8 T22 12",
  "M2 12 Q4 8, 6 12 T10 16 T14 8 T18 16 T22 12",
];

export const NavActions = forwardRef<HTMLDivElement>(
  function NavActions(_, ref) {
    const [menuOpen, setMenuOpen] = useState(false);

    const talkBtnRef = useRef<HTMLButtonElement>(null);
    const arrowRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const dotRef = useRef<HTMLSpanElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const roundBtnRef = useRef<HTMLButtonElement>(null);
    const menuBtnRef = useRef<HTMLButtonElement>(null);
    const menuDotsRef = useRef<HTMLSpanElement>(null);
    const menuTextRef = useRef<HTMLSpanElement>(null);
    const flairRef = useRef<HTMLSpanElement>(null);
    const linePathRef = useRef<SVGPathElement>(null);
    const menuPanelRef = useRef<HTMLDivElement>(null);

    const cleanupRef = useRef<(() => void) | null>(null);
    const initializedRef = useRef(false);
    const gsapRef = useRef<typeof GsapType | null>(null);

    // Track wave state
    const waveActiveRef = useRef(false);
    const waveTlRef = useRef<gsap.core.Timeline | null>(null);
    const flatTweenRef = useRef<gsap.core.Tween | null>(null);

    // rerender-functional-setstate: toggle menu
    const toggleMenu = useCallback(() => {
      setMenuOpen((prev) => !prev);
    }, []);

    useEffect(() => {
      // advanced-init-once: prevent double init in dev
      if (initializedRef.current) return;
      initializedRef.current = true;

      let cancelled = false;

      async function init() {
        // async-parallel: load GSAP and audio in parallel
        const [{ loadGsap }, audio] = await Promise.all([
          import("@/lib/gsap"),
          import("@/lib/audio"),
        ]);
        const { gsap } = await loadGsap();

        if (cancelled) return;

        gsapRef.current = gsap;

        const btn = talkBtnRef.current;
        const arrow = arrowRef.current;
        const text = textRef.current;
        const dot = dotRef.current;
        const roundBtn = roundBtnRef.current;
        const menuBtn = menuBtnRef.current;
        const menuDots = menuDotsRef.current;
        const flair = flairRef.current;
        const linePath = linePathRef.current;

        if (
          !btn ||
          !arrow ||
          !text ||
          !dot ||
          !roundBtn ||
          !menuBtn ||
          !menuDots ||
          !flair ||
          !linePath
        )
          return;

        // ── Let's Talk hover timeline ──
        const tl = gsap.timeline({ paused: true });

        tl.to(
          btn,
          { backgroundColor: "#0016ec", duration: 0.35, ease: "power2.out" },
          0,
        );

        tl.to(
          dot,
          { opacity: 0, scale: 0, duration: 0.25, ease: "power2.out" },
          0,
        );

        tl.to(text, { x: 6, duration: 0.35, ease: "power2.out" }, 0);

        tl.fromTo(
          arrow,
          { x: -32, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, ease: "power4.out" },
          0,
        );

        tlRef.current = tl;

        // ── Let's Talk: pop + animation ──
        const onTalkEnter = () => {
          audio.playRandomPop();
          tl.play();
        };
        const onTalkLeave = () => tl.reverse();

        btn.addEventListener("mouseenter", onTalkEnter);
        btn.addEventListener("mouseleave", onTalkLeave);

        // ── Menu: pop + dots rotation ──
        const onMenuEnter = () => {
          audio.playRandomPop();
          gsap.to(menuDots, {
            rotation: 90,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const onMenuLeave = () => {
          gsap.to(menuDots, {
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        menuBtn.addEventListener("mouseenter", onMenuEnter);
        menuBtn.addEventListener("mouseleave", onMenuLeave);

        // ── Round button flair ──
        gsap.set(flair, { scale: 0, xPercent: -50, yPercent: -50 });

        const onRoundEnter = (e: MouseEvent) => {
          audio.playRandomPop();

          const rect = roundBtn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          gsap.set(flair, { left: x, top: y });
          gsap.to(flair, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
          gsap.to(linePath, {
            stroke: "#fff",
            duration: 0.15,
            ease: "power2.out",
          });
        };

        const onRoundLeave = (e: MouseEvent) => {
          const rect = roundBtn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          gsap.set(flair, { left: x, top: y });
          gsap.to(flair, {
            scale: 0,
            duration: 0.5,
            ease: "power2.out",
          });
          gsap.to(linePath, {
            stroke: "#262626",
            duration: 0.15,
            ease: "power2.out",
          });
        };

        // ── Wave animation helper ──
        function startWaveAnimation() {
          waveTlRef.current?.kill();

          const waveTl = gsap.timeline({ repeat: -1 });

          const len = WAVE_PATHS.length;
          for (let i = 0; i < len; i++) {
            waveTl.to(linePath, {
              attr: { d: WAVE_PATHS[i] },
              duration: 0.15,
              ease: "sine.inOut",
            });
          }

          waveTlRef.current = waveTl;
        }

        // ── Round button click: music + wave toggle ──
        const onRoundClick = () => {
          if (!waveActiveRef.current) {
            waveActiveRef.current = true;

            flatTweenRef.current?.kill();
            flatTweenRef.current = null;

            audio.playMusic();
            startWaveAnimation();
          } else {
            waveActiveRef.current = false;

            waveTlRef.current?.kill();
            waveTlRef.current = null;

            audio.stopMusic();

            flatTweenRef.current = gsap.to(linePath, {
              attr: { d: LINE_FLAT },
              duration: 0.6,
              ease: "elastic.out(1, 0.5)",
            });
          }
        };

        roundBtn.addEventListener("mouseenter", onRoundEnter);
        roundBtn.addEventListener("mouseleave", onRoundLeave);
        roundBtn.addEventListener("click", onRoundClick);

        // advanced-event-handler-refs: store cleanup in ref
        cleanupRef.current = () => {
          btn.removeEventListener("mouseenter", onTalkEnter);
          btn.removeEventListener("mouseleave", onTalkLeave);
          menuBtn.removeEventListener("mouseenter", onMenuEnter);
          menuBtn.removeEventListener("mouseleave", onMenuLeave);
          roundBtn.removeEventListener("mouseenter", onRoundEnter);
          roundBtn.removeEventListener("mouseleave", onRoundLeave);
          roundBtn.removeEventListener("click", onRoundClick);
          waveTlRef.current?.kill();
          flatTweenRef.current?.kill();
          audio.destroyAudio();
        };
      }

      init();

      return () => {
        cancelled = true;
        cleanupRef.current?.();
        tlRef.current?.kill();
      };
    }, []);

    return (
      <div
        ref={ref}
        className="relative flex items-center gap-3 will-change-transform"
      >
        {/* Round icon button */}
        <button
          ref={roundBtnRef}
          type="button"
          aria-label="Toggle music"
          className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/90 backdrop-blur-sm"
        >
          <span
            ref={flairRef}
            className="pointer-events-none absolute"
            style={{
              width: "200%",
              aspectRatio: "1/1",
              borderRadius: "50%",
              backgroundColor: "#0016ec",
              transform: "translate(-50%, -50%) scale(0)",
              willChange: "transform",
            }}
          />
          <svg
            className="relative z-10"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              ref={linePathRef}
              d={LINE_FLAT}
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>

        {/* Let's Talk */}
        <button
          ref={talkBtnRef}
          type="button"
          style={{ backgroundColor: "#2b2e3a" }}
          className="relative flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-xs font-semibold tracking-wide text-white uppercase"
        >
          <span
            ref={arrowRef}
            className="flex items-center"
            style={{ opacity: 0, transform: "translateX(-32px)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d={ARROW_PATH}
              />
            </svg>
          </span>
          <span ref={textRef}>{TALK_TEXT}</span>
          <span ref={dotRef} className="h-1.5 w-1.5 rounded-full bg-white/60" />
        </button>

        {/* Menu / Close */}
        <button
          ref={menuBtnRef}
          type="button"
          onClick={toggleMenu}
          className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-3.5 text-xs font-semibold tracking-wide text-neutral-800 uppercase backdrop-blur-sm"
        >
          <span ref={menuTextRef}>{menuOpen ? CLOSE_TEXT : MENU_TEXT}</span>
          <span
            ref={menuDotsRef}
            className="flex gap-1"
            style={{ willChange: "transform" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-800/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-800/60" />
          </span>
        </button>

        {/* Menu Panel */}
        <MenuPanel ref={menuPanelRef} isOpen={menuOpen} />
      </div>
    );
  },
);
