'use client';

import { useTransitionRouter } from 'next-view-transitions';
import { slideInOut } from '@/components/transitions/effects';
import { isExternalUrl } from '@/lib/utils';
import { getPathnameWithoutLocale } from '@/lib/utils';

/**
 * Hook to provide transition navigation functions
 */
export function useTransitionNavigation() {
  const router = useTransitionRouter();

  /**
   * Navigate to a new URL with a transition
   * @param url Destination URL
   */
  const navigateWithTransition = async (url: string) => {
    console.log("Navigation to: ", url);
    router.push(url, { onTransitionReady: slideInOut });
  };

  /**
   * Handle link click with transition
   * @param e Click event
   * @param href Destination URL
   */
  const handleLinkClick = async <T extends Element>(
    e: React.MouseEvent<T, MouseEvent>,
    href: string
  ) => {
    e.preventDefault();
    if (isExternalUrl(href)) {
      window.open(href, '_blank');
    } else if (href !== getPathnameWithoutLocale(window.location.pathname)) {
      await navigateWithTransition(href);
    }
  };

  return {
    navigateWithTransition,
    handleLinkClick,
  };
}
