export interface Feature {
  readonly label: string
  readonly description: string
}

export interface FeatureListProps {
  features: readonly Feature[]
  labelColor: string
  descriptionColor: string
  lineColor: string
}

export interface SectionLayoutProps {
  headline: string
  features: readonly Feature[]
  bg?: string
  headlineColor?: string
  labelColor?: string
  descriptionColor?: string
  lineColor?: string
  className?: string
  theme?: 'dark' | 'light'
  noFluid?: boolean
  children?: React.ReactNode
}
