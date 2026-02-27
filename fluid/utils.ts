import { Color, Vector3 } from 'three'

export function hexToRgb(hex: string): Vector3 {
  const color = new Color(hex)
  return new Vector3(color.r, color.g, color.b)
}
