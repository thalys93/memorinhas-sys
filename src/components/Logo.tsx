
import React from 'react';

export const Logo: React.FC<{ size?: number; showText?: boolean }> = ({ size = 40, showText = false }) => {
  return (
    <div className="flex flex-col items-center gap-1 group cursor-pointer">
      <div 
        style={{ width: size, height: size }} 
        className="relative flex items-center justify-center transition-transform group-hover:scale-105"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* House Shape */}
          <path 
            d="M50 15L15 45V85H85V45L50 15Z" 
            stroke="#b99778" 
            strokeWidth="4" 
            strokeLinejoin="round" 
          />
          <rect x="70" y="30" width="8" height="15" fill="#b99778" /> {/* Chimney */}
          
          {/* Camera Body */}
          <rect x="30" y="48" width="40" height="25" rx="4" fill="#94a3b8" />
          <rect x="40" y="44" width="20" height="4" rx="1" fill="#94a3b8" />
          
          {/* Lens Circle */}
          <circle cx="50" cy="60.5" r="10" fill="white" />
          
          {/* Red Heart */}
          <path 
            d="M50 64C50 64 45 61 45 58.5C45 56.567 46.567 55 48.5 55C49.3333 55 50 55.6667 50 56.5C50 55.6667 50.6667 55 51.5 55C53.433 55 55 56.567 55 58.5C55 61 50 64 50 64Z" 
            fill="#ef4444" 
          />
        </svg>
      </div>
      {showText && (
        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-700 uppercase">
          Memorinhas
        </span>
      )}
    </div>
  );
};
