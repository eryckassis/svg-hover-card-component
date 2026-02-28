import { FeatureList } from './feature-list'
import type { SectionLayoutProps } from './types'

export function SectionLayout({
  headline,
  features,
  bg = 'bg-white',
  headlineColor = 'text-gray-900',
  labelColor = '#1a1a1a',
  descriptionColor = '#5F5F5F',
  lineColor = '#e0e0e0',
  className = '',
  theme,
  children,
}: SectionLayoutProps) {
  return (
    <section
      data-theme={theme}
      className={`w-full px-6 sm:px-10 lg:px-14 xl:px-16 pt-16 sm:pt-20 xl:pt-28 pb-10 sm:pb-12 xl:pb-16 ${bg} ${className}`}
    >
      <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 xl:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-14 xl:gap-20">
        <h2
          className={`relative mt-0 mb-0 ml-0 2xl:ml-16 min-[2200px]:ml-90 max-w-[18ch] text-[clamp(1.8rem,3.5vw,3.2em)] font-normal leading-[1.2] tracking-[-0.01em] ${headlineColor}`}
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
  )
}
