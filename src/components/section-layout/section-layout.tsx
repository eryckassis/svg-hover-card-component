import { FeatureList } from "./feature-list";
import type { SectionLayoutProps } from "./types";

export function SectionLayout({
  headline,
  features,
  bg = "bg-white",
  headlineColor = "text-gray-900",
  labelColor = "#1a1a1a",
  descriptionColor = "#5F5F5F",
  lineColor = "#e0e0e0",
  className = "",
  theme,
  children,
}: SectionLayoutProps) {
  return (
    <section
      data-theme={theme}
      className={`w-full px-16 pt-28 pb-16 max-[1000px]:px-6 ${bg} ${className}`}
    >
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-20 max-[1000px]:grid-cols-1">
        <h2
          className={`relative mt-0 mb-0 ml-90 max-w-[18ch] text-[3.2em] font-normal leading-[1.2] tracking-[-0.01em] ${headlineColor}`}
        >
          {headline}
        </h2>
        <FeatureList
          features={features}
          labelColor={labelColor}
          descriptionColor={descriptionColor}
          lineColor={lineColor}
        />
      </div>
      {children}
    </section>
  );
}
