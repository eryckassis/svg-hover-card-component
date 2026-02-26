"use client";

import { forwardRef } from "react";
import { MenuLinks } from "./menu-links";
import { MenuNewsletter } from "./menu-newsletter";
import { MenuLabs } from "./menu-labs";

type MenuPanelProps = {
  isOpen: boolean;
};

export const MenuPanel = forwardRef<HTMLDivElement, MenuPanelProps>(
  function MenuPanel({ isOpen }, ref) {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="absolute right-0 top-full z-40 flex w-[340px] flex-col gap-2 pt-3"
      >
        {/* Links section */}
        <MenuLinks />

        {/* Newsletter section */}
        <MenuNewsletter />

        {/* Labs section */}
        <MenuLabs />
      </div>
    );
  },
);
