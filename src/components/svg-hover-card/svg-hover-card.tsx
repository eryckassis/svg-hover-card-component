"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { SVG_STROKE_1, SVG_STROKE_2 } from "./svg-paths";
import type { CardData } from "./type";
import type { default as GsapType } from "gsap";

const HOVER_DELAY = 190;

export function SvgHoverCard({
  id,
  title,
  imageSrc,
  videoSrc,
  strokeColor,
  strokeColorSecondary,
  logoSrc,
  logoAlt,
  externalUrl,
  headline,
  description,
  tags,
}: CardData) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<typeof GsapType | null>(null);
  const tlRef = useRef<ReturnType<typeof GsapType.timeline> | null>(null);
  const splitRef = useRef<{ words: Element[] } | null>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const enterDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cancelled = false;

    async function init() {
      const { loadGsap } = await import("../../lib/gsap");
      const { gsap, SplitText } = await loadGsap();

      if (cancelled) return;

      gsapRef.current = gsap;

      const container = containerRef.current;
      if (!container) return;

      // Setup SVG paths
      const paths = Array.from(
        container.querySelectorAll<SVGPathElement>(".svg-stroke path"),
      );
      pathsRef.current = paths;

      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.classList.add("ready");
      });

      // Setup título com SplitText
      const titleEl = container.querySelector<HTMLElement>(".card-title h3");
      if (titleEl) {
        const split = SplitText.create(titleEl, {
          type: "words",
          mask: "words",
          wordsClass: "word",
        });
        splitRef.current = split;
        gsap.set(split.words, { yPercent: 100 });
      }

      // Esconder overlay content no init
      if (overlayRef.current) {
        const overlayElements =
          overlayRef.current.querySelectorAll(".overlay-item");
        gsap.set(overlayElements, { opacity: 0, y: 20 });
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const playEnter = useCallback(() => {
    const gsap = gsapRef.current;
    if (!gsap) return;

    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Animar SVG strokes
    pathsRef.current.forEach((path, i) => {
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          attr: { "stroke-width": 700 },
          duration: 3.5,
          ease: "power3.out",
        },
        i * 0.3,
      );
    });

    // Animar título (SplitText)
    if (splitRef.current) {
      tl.to(
        splitRef.current.words,
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.075,
        },
        0.5,
      );
    }

    // Animar overlay content (logo, headline, desc, tags)
    if (overlayRef.current) {
      const overlayElements =
        overlayRef.current.querySelectorAll(".overlay-item");
      tl.to(
        overlayElements,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        },
        0.6,
      );
    }
  }, []);

  const handlePointerEnter = useCallback(() => {
    if (enterDelayRef.current) clearTimeout(enterDelayRef.current);
    enterDelayRef.current = setTimeout(playEnter, HOVER_DELAY);
  }, [playEnter]);

  const handlePointerLeave = useCallback(() => {
    if (enterDelayRef.current) {
      clearTimeout(enterDelayRef.current);
      enterDelayRef.current = null;
    }

    const gsap = gsapRef.current;
    if (!gsap) return;

    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Reverter overlay content PRIMEIRO
    if (overlayRef.current) {
      const overlayElements =
        overlayRef.current.querySelectorAll(".overlay-item");
      tl.to(
        overlayElements,
        {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power3.out",
          stagger: { each: 0.05, from: "end" },
        },
        0,
      );
    }

    // Reverter SVG strokes
    pathsRef.current.forEach((path) => {
      const length = path.getTotalLength();
      tl.to(
        path,
        {
          strokeDashoffset: length,
          attr: { "stroke-width": 200 },
          duration: 1.8,
          ease: "power3.out",
        },
        0,
      );
    });

    // Reverter título (SplitText)
    if (splitRef.current) {
      tl.to(
        splitRef.current.words,
        {
          yPercent: 100,
          duration: 0.8,
          ease: "power3.out",
          stagger: { each: 0.05, from: "end" },
        },
        0,
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id={id}
      className="relative flex-1 aspect-square max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden cursor-pointer bg-[#0000001a]"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Mídia */}
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 1000px) 100vw, 50vw"
          className="object-cover"
          priority={false}
          unoptimized
        />
      ) : null}

      {/* SVG Strokes */}
      <div className="svg-stroke absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          className="min-w-[150%] min-h-[150%] w-[150%] h-[150%]"
          viewBox={SVG_STROKE_1.viewBox}
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={SVG_STROKE_1.path}
            stroke={strokeColor}
            strokeWidth={200}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="svg-stroke absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          className="min-w-[150%] min-h-[150%] w-[150%] h-[150%]"
          viewBox={SVG_STROKE_2.viewBox}
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={SVG_STROKE_2.path}
            stroke={strokeColorSecondary ?? "var(--color-stroke-base)"}
            strokeWidth={200}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Conteúdo overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none"
      >
        {/* Header: logo + link externo */}
        <div className="flex items-start justify-between">
          {logoSrc ? (
            <div className="overlay-item">
              <Image
                src={logoSrc}
                alt={logoAlt ?? ""}
                width={120}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </div>
          ) : (
            <div />
          )}

          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="overlay-item pointer-events-auto flex items-center justify-center w-9 h-9 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40"
              aria-label="Open external link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black/70"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : null}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex flex-col gap-3">
          {headline ? (
            <h2 className="overlay-item text-[clamp(1.5rem,2.5vw,1rem)] font-semibold leading-[1.1] tracking-[-0.03rem] text-[#3e3e3e]">
              {headline}
            </h2>
          ) : null}

          {description ? (
            <p className="overlay-item max-w-sm text-[clamp(0.8rem,1vw,1rem)] leading-[1.5] text-[#3e3e3e]">
              {description}
            </p>
          ) : null}

          {tags && tags.length > 0 ? (
            <div className="overlay-item flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[#e5e5e5] px-5 py-4 text-sm font-medium text-[#3e3e3e]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Título (SplitText) */}
          <div className="card-title">
            <h3 className="text-[clamp(2rem,2.5vw,3rem)] font-[450] leading-[1.25] tracking-[-0.025rem] text-[var(--color-copy)]">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
