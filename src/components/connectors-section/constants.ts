import type { ShuffleItem } from './types'

export const ACCENTS = [
  '#4060ff',
  '#a9ff3a',
  '#f64141',
  '#9d2eff',
  '#ffcc01',
] as const

export const BACKGROUND_COLOR = '#141516'

export function shuffle(accent = 0): ShuffleItem[] {
  return [
    { color: '#444', roughness: 0.1 },
    { color: '#444', roughness: 0.75 },
    { color: '#444', roughness: 0.75 },
    { color: '#444', roughness: 0.1 },
    { color: 'white', roughness: 0.1 },
    { color: 'white', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
    { color: 'white', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
    { color: ACCENTS[accent], roughness: 0.1, accent: true },
    { color: ACCENTS[accent], roughness: 0.75, accent: true },
    { color: ACCENTS[accent], roughness: 0.1, accent: true },
    { color: ACCENTS[accent], roughness: 0.75, accent: true },
    { color: ACCENTS[accent], roughness: 0.1, accent: true },
    { color: '#444', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
    { color: '#444', roughness: 0.1 },
    { color: '#444', roughness: 0.75 },
    { color: '#444', roughness: 0.75 },
    { color: '#444', roughness: 0.1 },
    { color: 'white', roughness: 0.1 },
    { color: 'white', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
    { color: 'white', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
    { color: ACCENTS[accent], roughness: 0.1, accent: true },
    { color: ACCENTS[accent], roughness: 0.95, accent: true },
    { color: ACCENTS[accent], roughness: 0.1, accent: true },
    { color: ACCENTS[accent], roughness: 0.75, accent: true },
    { color: ACCENTS[accent], roughness: 1, accent: true },
    { color: '#444', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
  ]
}
