'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device is mobile
 * @param breakpoint - Width in pixels below which the device is considered mobile (default: 768px)
 * @returns boolean - true if the device is considered mobile
 */
export function useIsMobile(breakpoint = 768): boolean {
  // Default state to undefined to avoid hydration errors
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Function to check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check immediately
    checkMobile();

    // Set up event listener for resize events
    window.addEventListener('resize', checkMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  // Return false during server-side rendering to avoid hydration errors
  return isMobile ?? false;
}

// Usage example:
// const isMobile = useIsMobile();
// const isMobile = useIsMobile(640); // Custom breakpoint
