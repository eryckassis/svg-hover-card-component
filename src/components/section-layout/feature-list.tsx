import type { FeatureListProps } from './types'

export function FeatureList({
  features,
  labelColor,
  descriptionColor,
  lineColor,
}: FeatureListProps) {
  return (
    <div className="ml-50 flex flex-col">
      {features.map((feature) => (
        <div key={feature.label}>
          <div className="flex items-start gap-[8vw] pb-8 pt-13">
            <span
              className="w-[300px] shrink-0 pt-0.5 font-mono text-[0.82em] font-normal uppercase leading-[1.1] tracking-[0.01em]"
              style={{ color: labelColor }}
            >
              {feature.label}
            </span>
            <p
              className="max-w-[350px] text-[1.2em] font-normal leading-[1.65]"
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
