'use client';

import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'motion/react';
import React from 'react';

interface AuroraTextProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function AuroraText({
  className,
  children,
  as: Component = 'span',
  ...props
}: AuroraTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn('relative inline-block bg-clip-text text-transparent', className)}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-1))] via-[hsl(var(--color-2))] to-[hsl(var(--color-3))] bg-clip-text text-transparent animate-aurora-text">
        {children}
      </span>
      <span className="invisible">{children}</span>
    </MotionComponent>
  );
}
