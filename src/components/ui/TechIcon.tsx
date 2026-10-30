import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

export const getDeviconSvgUrl = (className: string) => {
  if (!className.startsWith('devicon-')) return className;
  const parts = className.split('-');
  const name = parts[1];
  const version = parts.slice(2).join('-');
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${version}.svg`;
}

interface TechIconProps {
  name?: string;
  icon?: string;
  component?: ElementType;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-13 h-13 sm:w-14 sm:h-14'
};

export const TechIcon = ({ 
  name, 
  icon, 
  component: Component, 
  className,
  size = 'md',
  showLabel = false
}: TechIconProps) => {
  const sizeClass = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center gap-2 group/icon select-none", className)}>
      <div className={cn("relative flex items-center justify-center transition-transform duration-300 group-hover/icon:scale-110", sizeClass)}>
        {Component ? (
          <div className="w-full h-full opacity-85 hover:opacity-100 transition-all duration-300 drop-shadow-sm flex items-center justify-center">
            <Component className="w-full h-full object-contain" />
          </div>
        ) : icon ? (
          <>
            {/* Hidden image ensures loaders like LogoLoop wait for the image to download */}
            <img src={getDeviconSvgUrl(icon)} alt={name || 'icon'} className="hidden" />
            <div 
              className="w-full h-full text-muted-foreground group-hover/icon:text-primary transition-colors duration-300 drop-shadow-sm"
              style={{
                backgroundColor: 'currentColor',
                WebkitMaskImage: `url(${getDeviconSvgUrl(icon)})`,
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskImage: `url(${getDeviconSvgUrl(icon)})`,
                maskSize: 'contain',
                maskPosition: 'center',
                maskRepeat: 'no-repeat',
              }}
            />
          </>
        ) : null}
      </div>
      {showLabel && name && (
        <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70 group-hover/icon:text-foreground transition-colors duration-300 whitespace-nowrap">
          {name}
        </span>
      )}
    </div>
  );
};
