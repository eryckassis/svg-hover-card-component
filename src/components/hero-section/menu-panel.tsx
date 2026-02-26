"use client";

import { forwardRef, useRef } from "react";
import { MenuLinks } from "./menu-links";
import { MenuNewsletter } from "./menu-newsletter";
import { MenuLabs } from "./menu-labs";
import { useMenuAnimation } from "./use-menu-animations";

type MenuPanelProps = {
  isOpen: boolean;
};

export const MenuPanel = forwardRef<HTMLDivElement, MenuPanelProps>(
  function MenuPanel({ isOpen }, ref) {
    // Use internal ref for animation, merge with external ref
    const internalRef = useRef<HTMLDivElement>(null);

    // Merge refs
    const setRef = (node: HTMLDivElement | null) => {
      (internalRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    // GSAP animation
    useMenuAnimation(internalRef, isOpen);

    return (
      <div
        ref={setRef}
        className="absolute right-0 top-full mt-3 flex w-[340px] flex-col gap-3"
        style={{
          visibility: "hidden",
          willChange: "transform, opacity",
        }}
      >
        {/* Section 1: Links — tilts left, pivots bottom-right */}
        <div style={{ willChange: "transform, opacity" }}>
          <MenuLinks />
        </div>

        {/* Section 2: Newsletter — tilts right, pivots bottom-left */}
        <div style={{ willChange: "transform, opacity" }}>
          <MenuNewsletter />
        </div>

        {/* Section 3: Labs — tilts left, pivots bottom-right */}
        <div style={{ willChange: "transform, opacity" }}>
          <MenuLabs />
        </div>
      </div>
    );
  },
);
