import React from 'react';

/**
 * AppLogo — Official Emblem for R&D ImpactFlow (Yayasan Khoirur Rooziqiin)
 * Design concept:
 * - Fresh modern Hijau Tosca & Warm White gradient (Startup kekinian)
 * - Upward soaring impact graph & caring hands / crescent motif (Khoirur Rooziqiin - Provider of Sustenance)
 * - Scalable vector graphic with elegant soft drop-shadow
 */
export const AppLogo = ({ className = "w-12 h-12", size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Background rounded tile gradient - Modern Hijau Tosca to Soft Mint */}
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>

        {/* Dynamic flowing curve gradient - Soft White to Warm Mint */}
        <linearGradient id="flowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ccfbf1" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#a7f3d0" />
        </linearGradient>

        {/* Growth spark gradient - Soft Warm Gold/Yellow to White */}
        <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Soft shadow filter */}
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f766e" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer rounded squircle background */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill="url(#logoBgGrad)"
        filter="url(#logoGlow)"
      />

      {/* Subtle glass reflection highlight */}
      <path
        d="M6 18C6 11.3726 11.3726 6 18 6H46C52.6274 6 58 11.3726 58 18V26C58 26 44 22 32 25C20 28 6 34 6 34V18Z"
        fill="white"
        fillOpacity="0.16"
      />

      {/* Stylized Caring Hand & Impact Growth Curve (Left to Right Flow) */}
      <path
        d="M14 43C16.5 35.5 24 33 30 36.5C36 40 41 38 46 29C48.5 24.5 49.5 21 49.5 21C49.5 21 51 26 48.5 32C45 40 37 45.5 29 45C22.5 44.5 17 46 14 48V43Z"
        fill="url(#flowGrad)"
        fillOpacity="0.95"
      />

      {/* Second Soaring Ribbon (Ascending Research & Social Impact Line) */}
      <path
        d="M18 47C23 41 31 39 37 32C42 26 46 18 47 15C47 15 48.5 21 45 28C40.5 37 31 46 18 47Z"
        fill="white"
        fillOpacity="0.8"
      />

      {/* Sustenance & Blessing Spark (Khoirur Rooziqiin Inspiration) */}
      <path
        d="M37 15L39.2 21.2L45.4 23.4L39.2 25.6L37 31.8L34.8 25.6L28.6 23.4L34.8 21.2L37 15Z"
        fill="url(#sparkGrad)"
      />

      {/* Center Innovation Node */}
      <circle cx="37" cy="23.4" r="2.2" fill="#ffffff" />
      <circle cx="21" cy="38" r="2.5" fill="#99f6e4" fillOpacity="0.9" />
      <circle cx="48" cy="35" r="2" fill="#ccfbf1" fillOpacity="0.8" />
    </svg>
  );
};
