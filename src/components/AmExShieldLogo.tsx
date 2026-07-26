import React from 'react';

interface AmExShieldLogoProps {
  className?: string;
  size?: number;
}

export const AmExShieldLogo: React.FC<AmExShieldLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Electric AmEx Blue & Cyan Gradient */}
        <linearGradient id="amexCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0070F3" />
          <stop offset="100%" stopColor="#00388D" />
        </linearGradient>

        <linearGradient id="amexCyanLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Ambient Glow */}
        <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38BDF8" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Minimalist Outer Shield Geometry */}
      <path
        d="M50 10 L84 24 V48 C84 70 69 88 50 94 C31 88 16 70 16 48 V24 L50 10 Z"
        stroke="url(#amexCyanGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cyanGlow)"
        fill="rgba(0, 112, 243, 0.08)"
      />

      {/* Minimalist Geometric "A" Spearhead Monogram */}
      <path
        d="M50 24 L72 68 H61 L50 44 L39 68 H28 L50 24 Z"
        fill="url(#amexCyanLight)"
      />

      {/* Central Trust Anchor Horizontal Bar */}
      <path
        d="M38 54 H62"
        stroke="#38BDF8"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
