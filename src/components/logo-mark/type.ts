export interface Logo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface LogoMarkProps {
  logos: Logo[];
  speed?: number;
  fadeColor?: string;
}
