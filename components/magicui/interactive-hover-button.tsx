import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold',
        disabled && 'cursor-not-allowed opacity-70',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'h-2 w-2 rounded-full bg-primary transition-all duration-300',
            !disabled && 'group-hover:scale-[100.8]'
          )}
        ></div>
        <span
          className={cn(
            'inline-block transition-all duration-300',
            !disabled && 'group-hover:translate-x-12 group-hover:opacity-0'
          )}
        >
          {children}
        </span>
      </div>
      <div
        className={cn(
          'absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300',
          !disabled && 'group-hover:-translate-x-5 group-hover:opacity-100'
        )}
      >
        <span>{children}</span>
        <ArrowRight />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';
