import React from 'react';

interface SnapTaskLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const SnapTaskLogo: React.FC<SnapTaskLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div
        className={`${iconDimensions} rounded-xl bg-indigo-50/60 p-1 flex items-center justify-center relative overflow-hidden transition-transform duration-200 hover:scale-105`}
      >
        {/* Crisp vector recreation matching Image 1 */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#4F46E5]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-left corner bracket */}
          <path
            d="M 32 18 H 22 C 16 18 12 22 12 28 V 38"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Top-right corner bracket */}
          <path
            d="M 68 18 H 78 C 84 18 88 22 88 28 V 38"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Bottom-left corner bracket */}
          <path
            d="M 32 82 H 22 C 16 82 12 78 12 72 V 62"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Bottom-right corner bracket */}
          <path
            d="M 68 82 H 78 C 84 82 88 78 88 72 V 62"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Checkmark in center */}
          <path
            d="M 28 50 L 44 66 L 72 34"
            stroke="currentColor"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-bold tracking-tight text-[#131B2E] dark:text-white ${textSizes}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Snap<span className="text-[#4F46E5] dark:text-indigo-400">Task</span>
        </span>
      )}
    </div>
  );
};
