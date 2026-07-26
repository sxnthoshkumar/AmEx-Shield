import React from 'react';

interface AmExShieldLogoProps {
  className?: string;
  size?: number;
}

export const AmExShieldLogo: React.FC<AmExShieldLogoProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Authentic AmEx Blue Box Gradient */}
        <linearGradient id="amexBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0072CE" />
          <stop offset="50%" stopColor="#0055A5" />
          <stop offset="100%" stopColor="#002F6C" />
        </linearGradient>

        {/* Gold Border Accent */}
        <linearGradient id="amexBorderGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF1B8" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7513" />
        </linearGradient>

        {/* Drop Shadow */}
        <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0072CE" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Iconic AmEx Rounded Square Blue Box */}
      <rect
        x="6"
        y="6"
        width="128"
        height="128"
        rx="22"
        fill="url(#amexBlueGrad)"
        stroke="url(#amexBorderGold)"
        strokeWidth="3"
        filter="url(#boxShadow)"
      />

      {/* Inner White Box Frame Line */}
      <rect
        x="13"
        y="13"
        width="114"
        height="114"
        rx="16"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* Centurion Gladiator Silhouette (Authentic AmEx Crest Detail) */}
      <path
        d="M70 24 C55 24 43 36 43 51 C43 62 50 71 60 76 L60 84 L80 84 L80 76 C90 71 97 62 97 51 C97 36 85 24 70 24 Z"
        fill="#FFFFFF"
        fillOpacity="0.12"
      />

      {/* Centurion Helmet Crest Arc */}
      <path
        d="M52 46 C52 38 60 32 70 32 C80 32 88 38 88 46"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Iconic AmEx Double-Line Outlined Typography: "AMERICAN" / "EXPRESS" -> "AMEX" / "SHIELD" */}
      {/* Top Text Line: "AMEX" */}
      <text
        x="70"
        y="62"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="22"
        fontWeight="900"
        fontFamily="'Inter', 'Arial Black', sans-serif"
        letterSpacing="2.5"
      >
        AMEX
      </text>

      {/* Bottom Text Line: "SHIELD" */}
      <text
        x="70"
        y="92"
        textAnchor="middle"
        fill="#F5D061"
        fontSize="20"
        fontWeight="900"
        fontFamily="'Inter', 'Arial Black', sans-serif"
        letterSpacing="3"
      >
        SHIELD
      </text>

      {/* Decorative Gold Accent Bar */}
      <rect x="36" y="102" width="68" height="3" rx="1.5" fill="url(#amexBorderGold)" />
    </svg>
  );
};
