'use client';

import { useTransitionRouter } from 'next-view-transitions';
import { catTransition } from './effects';
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
    // Add a class to the body to temporarily disable interactions
    document.body.classList.add('transitioning');

    // Create and show the overlay BEFORE navigating
    const transitionPromise = catTransition();

    // Wait for the overlay to be visible before navigating
    await transitionPromise;

    // Now navigate to the new page
    router.push(url);
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
