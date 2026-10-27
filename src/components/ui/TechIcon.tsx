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
  xl: 'w-14 h-14'
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
    <div className={cn("flex flex-col items-center gap-2 group/icon", className)}>
      <div className={cn("relative flex items-center justify-center transition-transform duration-300 group-hover/icon:scale-110", sizeClass)}>
        {Component ? (
          <div className="w-full h-full opacity-50 grayscale transition-all duration-300 group-hover/icon:opacity-100 group-hover/icon:grayscale-0 drop-shadow-sm text-foreground">
            <Component className="w-full h-full" />
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
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 group-hover/icon:text-foreground transition-colors duration-300 whitespace-nowrap">
          {name}
        </span>
      )}
    </div>
  );
};
