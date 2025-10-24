'use client';

import React from 'react';

export default function TreinoGoLogo({ className }: { className?: string }) {
  return (
    <div className={className} aria-label="TreinoGO logo" role="img">
      <svg width="215" height="28" viewBox="0 0 215 28" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#0060DF' }} />
            <stop offset="100%" style={{ stopColor: '#1E90FF' }} />
          </linearGradient>
        </defs>
        <g>
          <g transform="translate(0,4)">
            <rect x="0" y="6" width="44" height="8" rx="4" fill="url(#grad)" />
            <polygon points="44,4 58,10 44,16" fill="#F06428" />
            <rect x="10" y="0" width="22" height="4" rx="2" fill="#1E90FF" opacity="0.7" />
            <rect x="10" y="20" width="18" height="4" rx="2" fill="#1E90FF" opacity="0.7" />
          </g>
          <text x="70" y="20" fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto" fontSize="18" fontWeight="700" fill="#0F172A">Treino</text>
          <text x="135" y="20" fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto" fontSize="18" fontWeight="700" fill="#F06428">GO</text>
        </g>
      </svg>
    </div>
  );
}