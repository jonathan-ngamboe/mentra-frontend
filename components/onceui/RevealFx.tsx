'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import styles from '@/styles/RevealFx.module.css';

interface RevealFxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  delay?: number;
  revealedByDefault?: boolean;
  translateY?: number | string;
  trigger?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const RevealFx = forwardRef<HTMLDivElement, RevealFxProps>(
  (
    {
      children,
      speed = 'medium',
      delay = 0,
      revealedByDefault = false,
      translateY,
      trigger,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const [isRevealed, setIsRevealed] = useState(revealedByDefault);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
      if (trigger !== undefined) {
        setIsRevealed(trigger);
      }
    }, [trigger]);

    const getSpeedDuration = () => {
      switch (speed) {
        case 'fast':
          return '1s';
        case 'medium':
          return '2s';
        case 'slow':
          return '3s';
        default:
          return '2s';
      }
    };

    const getTranslateYValue = () => {
      if (typeof translateY === 'number') {
        return `${translateY}rem`;
      } else if (typeof translateY === 'string') {
        return `var(--static-space-${translateY})`;
      }
      return '2rem'; 
    };

    const translateValue = translateY ? getTranslateYValue() : '0';

    const revealStyle: React.CSSProperties = {
      transitionDuration: getSpeedDuration(),
      transform: isRevealed ? 'translateY(0)' : `translateY(${translateValue})`,
      ...style,
    };

    return (
      <div
        className={`pointer-events-auto w-full relative flex justify-center ${styles.revealFx} ${
          isRevealed ? styles.revealed : styles.hidden
        } ${className || ''}`}
        ref={ref}
        style={revealStyle}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

RevealFx.displayName = 'RevealFx';
export { RevealFx };
