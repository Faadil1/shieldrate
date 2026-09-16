import type { SVGProps } from "react";

interface BrandMarkProps extends SVGProps<SVGSVGElement> {
  compact?: boolean;
}

export function BrandMark({ compact = false, className = "", ...props }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="SealedFit trust mark"
      className={`${compact ? "h-8 w-8" : "h-10 w-10"} ${className}`}
      {...props}
    >
      <path d="M8 7h36l12 12v38H8z" fill="#102c31" />
      <path d="M44 7v12h12" fill="#a64c3d" />
      <path d="M17 18h19l6 6-6 6H23l17 16" fill="none" stroke="#f4ead8" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M17 46h9" stroke="#2d8a6d" strokeWidth="5" strokeLinecap="square" />
      <circle cx="48" cy="46" r="4" fill="#d69747" />
    </svg>
  );
}
