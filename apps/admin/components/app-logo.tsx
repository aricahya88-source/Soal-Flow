import type { SVGProps } from "react";

export function AppLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Logo SoalFlow" {...props}>
      <defs>
        <linearGradient id="soalflow-logo-gradient" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FD1C5" />
          <stop offset="0.52" stopColor="#0A7C6E" />
          <stop offset="1" stopColor="#075F55" />
        </linearGradient>
        <linearGradient id="soalflow-accent-gradient" x1="38" y1="16" x2="54" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD166" />
          <stop offset="1" stopColor="#FF7A3D" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#soalflow-logo-gradient)" />
      <path d="M18 17.5h22.5a5.5 5.5 0 0 1 5.5 5.5v18a5.5 5.5 0 0 1-5.5 5.5H24a6 6 0 0 1-6-6v-23Z" fill="white" fillOpacity="0.96" />
      <path d="M24 25h15M24 31.5h11M24 38h8" stroke="#0A7C6E" strokeWidth="3.4" strokeLinecap="round" />
      <path d="m38 37 4 4 8-10" stroke="url(#soalflow-accent-gradient)" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48.5" cy="17" r="6.5" fill="#FFB347" />
      <path d="M48.5 13.7v6.6M45.2 17h6.6" stroke="#7A3E00" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
