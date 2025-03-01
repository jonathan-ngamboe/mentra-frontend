'use client';

import { useTheme } from 'next-themes';
import TransitionLink from '@/components/transitions/TransitionLink';
import Image from 'next/image';
import { siteName } from '@/resources/config';
import { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';

type LogoProps = {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';
  icon?: boolean;
  href?: string;
  className?: string;
  alt?: string;
  hideOnScroll?: boolean;
  id?: string;
};

declare global {
  interface Window {
    previousScrollY?: number;
  }
}

export const Logo = ({
  size = 'm',
  icon = false,
  href = '/',
  className = '',
  alt = `${siteName} logo`,
  hideOnScroll = false,
  id = 'logo',
}: LogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollThreshold = 30; // Minimum scroll distance to trigger change

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const previousScrollPos = lastScrollTop.current;
    const scrollDifference = Math.abs(currentScrollPos - previousScrollPos);

    // Only process if we've scrolled more than the threshold
    if (scrollDifference > scrollThreshold) {
      // Determine scroll direction
      const newDirection = currentScrollPos < previousScrollPos ? 'up' : 'down';

      // Only update if direction has changed
      if (newDirection !== scrollDirectionRef.current) {
        scrollDirectionRef.current = newDirection;

        // Clear any existing timer
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }

        // Set a timer to update visibility after a short delay
        scrollTimerRef.current = setTimeout(() => {
          setVisible(newDirection === 'up');
        }, 100); // 100ms delay to prevent flickering
      }

      // Update the last scroll position
      lastScrollTop.current = currentScrollPos;
    }
  }, []);

  useEffect(() => {
    if (hideOnScroll) {
      lastScrollTop.current = window.scrollY;
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Clean up event listener and timer on unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }
      };
    }
  }, [hideOnScroll, handleScroll]);

  // Size mapping to pixel dimensions for icon
  const sizeMap = {
    xs: { width: 40, height: 20, textSize: 'text-base' },
    s: { width: 60, height: 30, textSize: 'text-lg' },
    m: { width: 80, height: 40, textSize: 'text-xl' },
    l: { width: 100, height: 50, textSize: 'text-2xl' },
    xl: { width: 120, height: 60, textSize: 'text-3xl' },
    '2xl': { width: 160, height: 80, textSize: 'text-4xl' },
    '3xl': { width: 200, height: 100, textSize: 'text-5xl' },
  };

  // Get dimensions based on size prop
  const dimensions = sizeMap[size];

  // Determine logo path based on theme
  const getLogoPath = () => {
    if (!mounted) return '/logo-light.svg'; // Default for SSR
    const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
    return `/logo-${theme}.svg`;
  };

  const logoPath = getLogoPath();

  const transitionStyle: CSSProperties = {
    opacity: hideOnScroll ? (visible ? 1 : 0) : 1,
    transform: hideOnScroll ? (visible ? 'translateY(0)' : 'translateY(-20px)') : 'none',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    pointerEvents: hideOnScroll && !visible ? 'none' : 'auto',
  };

  // Create the appropriate logo element based on icon prop
  const logoElement = icon ? (
    // Icon version - show the SVG logo
    <div
      id={id}
      className={`relative ${className}`}
      style={
        {
          width: dimensions.width,
          height: dimensions.height,
          ...transitionStyle,
        } as CSSProperties
      }
    >
      <Image
        src={logoPath}
        width={dimensions.width}
        height={dimensions.height}
        alt={alt}
        priority
        className="w-full h-full object-contain"
      />
    </div>
  ) : (
    // Text version - show the site name as text
    <div
      id={id}
      className={`${dimensions.textSize} font-bold ${className}`}
      style={transitionStyle}
    >
      {siteName}
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return (
      <TransitionLink href={href} aria-label={alt} className="cursor-pointer z-40 relative">
        {logoElement}
      </TransitionLink>
    );
  }

  // Otherwise return the logo without a link
  return logoElement;
};
