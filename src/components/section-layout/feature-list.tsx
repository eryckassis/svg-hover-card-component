import type { FeatureListProps } from './types'

export function FeatureList({
  features,
  labelColor,
  descriptionColor,
  lineColor,
}: FeatureListProps) {
  return (
    <div className="ml-0 xl:ml-10 min-[2200px]:ml-50 flex flex-col">
      {features.map((feature) => (
        <div key={feature.label}>
          <div className="flex flex-col min-[1200px]:flex-row min-[1200px]:items-start gap-3 min-[1200px]:gap-[5vw] xl:gap-[6vw] 2xl:gap-[8vw] pb-6 pt-8 lg:pb-8 lg:pt-13">
            <span
              className="shrink-0 pt-0.5 font-mono text-[0.82em] font-normal uppercase leading-[1.1] tracking-[0.01em] min-[1200px]:w-[200px] xl:w-[250px] 2xl:w-[300px]"
              style={{ color: labelColor }}
            >
              {feature.label}
            </span>
            <p
              className="max-w-[500px] min-[1200px]:max-w-[300px] xl:max-w-[350px] text-[clamp(0.95rem,1.1vw,1.2em)] font-normal leading-[1.65]"
              style={{ color: descriptionColor }}
            >
              {feature.description}
            </p>
          </div>
          <div
            className="h-px max-w-[855px]"
            style={{ backgroundColor: lineColor }}
          />
        </div>
      ))}
    </div>
  )
}
