"use client";

import dynamic from "next/dynamic";
import {ScrollToExplore} from "@/components/scroll-to-explore";

const ConnectorsScene = dynamic(
  () =>
    import("./connectors-scene").then((mod) => ({
      default: mod.ConnectorsScene,
    })),
  { ssr: false },
);

export function ConnectorsSection() {
  return (
    <section className="w-full py-20 px-4">
        <ScrollToExplore />
      <ConnectorsScene />
    </section>
  );
}
