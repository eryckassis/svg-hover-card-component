import type { ReactNode } from 'react'

export interface ShuffleItem {
  color: string
  roughness: number
  accent?: boolean
}

export interface ModelProps {
  children?: ReactNode
  color?: string
  roughness?: number
}

export interface ConnectorProps {
  position?: [number, number, number]
  children?: ReactNode
  accent?: boolean
  color?: string
  roughness?: number
  burst?: number
}
