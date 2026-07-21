import React from 'react';
import { Store } from 'lucide-react';
import { STORE_NAME_FALLBACK } from '@/constants/store-branding';

type LogoProps = {
  size?: number;
  showText?: boolean;
  variant?: 'default' | 'store';
  framed?: boolean;
  label?: string;
};

export const Logo: React.FC<LogoProps> = ({
  size = 40,
  showText = false,
  variant = 'default',
  framed = true,
  label = STORE_NAME_FALLBACK,
}) => {
  if (variant === 'store') {
    const icon = <Store size={size} className="text-primary" strokeWidth={1.5} />;

    return (
      <div className="flex flex-col items-center gap-1">
        {framed ? (
          <div
            className="rounded-lg bg-muted flex items-center justify-center"
            style={{ width: size + 32, height: size + 32 }}
          >
            {icon}
          </div>
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center"
          >
            {icon}
          </div>
        )}
        {showText && (
          <span className="text-label text-muted-foreground uppercase tracking-[0.2em]">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 group cursor-pointer">
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0,0,0.5,1)] group-hover:scale-105"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
          <path
            d="M50 15L15 45V85H85V45L50 15Z"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <rect x="70" y="30" width="8" height="15" fill="currentColor" />
          <rect x="30" y="48" width="40" height="25" rx="4" fill="#94a3b8" />
          <rect x="40" y="44" width="20" height="4" rx="1" fill="#94a3b8" />
          <circle cx="50" cy="60.5" r="10" fill="white" />
          <path
            d="M50 64C50 64 45 61 45 58.5C45 56.567 46.567 55 48.5 55C49.3333 55 50 55.6667 50 56.5C50 55.6667 50.6667 55 51.5 55C53.433 55 55 56.567 55 58.5C55 61 50 64 50 64Z"
            fill="#ef4444"
          />
        </svg>
      </div>
      {showText && (
        <span className="text-label text-muted-foreground uppercase tracking-[0.2em]">
          {label}
        </span>
      )}
    </div>
  );
};
