"use client";

export function AnimatedLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animated-logo"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="logo-ring" />
      <g className="logo-blades">
        <path d="M14.31 8l5.74 9.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.69 8h11.48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.38 12l5.74-9.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.69 16L3.95 6.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.31 16H2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.62 12l-5.74 9.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* Glow pulse */}
      <circle cx="12" cy="12" r="4" className="logo-core" fill="currentColor" opacity="0" />
    </svg>
  );
}
