export type TwinArrowProps = {
  /** Additional classes for the outer wrapper */
  className?: string;
  /** Duration in seconds @default 0.5 */
  duration?: number;
  /** GSAP ease string @default "power2.out" */
  ease?: string;
  /** Listen hover on parent element instead of self @default false */
  hoverParent?: boolean;
  /** Pixel distance for the diagonal translate @default 16 */
  distance?: number;
  /** SVG width @default 24 */
  width?: number;
  /** SVG height @default 24 */
  height?: number;
  /** SVG stroke color @default "currentColor" */
  stroke?: string;
  /** SVG stroke width @default 2 */
  strokeWidth?: number;
};
