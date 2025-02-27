import { useTransitionRouter } from 'next-view-transitions';

/**
 * Create an smooth transition with crystal blur effect
 * @returns A promise that resolves when the overlay is ready
 */
export function portalTransition() {
  return new Promise<void>((resolve) => {
    // Create a transition overlay that will be visible immediately
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'transition-overlay active';
    document.body.appendChild(transitionOverlay);

    // Wait a short moment for the overlay to be visible
    setTimeout(() => {
      // Resolve the promise to allow Next.js to continue navigation
      // while our overlay is visible
      resolve();

      // Once the new page is loaded (but hidden by our overlay),
      // we can animate the exit transition of the overlay
      setTimeout(() => {
        // Overlay exit animation
        transitionOverlay.animate(
          [
            {
              opacity: 1,
              backdropFilter: 'blur(15px) brightness(130%)',
              background:
                'radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.3) 100%)',
            },
            {
              opacity: 0,
              backdropFilter: 'blur(0px) brightness(100%)',
              background:
                'radial-gradient(circle at center, transparent 100%, rgba(255,255,255,0) 100%)',
            },
          ],
          {
            duration: 800,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards',
          }
        ).onfinish = () => {
          transitionOverlay.remove();
          document.body.classList.remove('transitioning');
        };
      }, 100); // Short delay to ensure the new page is ready
    }, 50); // Minimal delay for the overlay to show before navigation
  });
}

/**
 * Navigate to a new URL with a transition
 * @param url Destination URL
 */
export async function navigateWithTransition(url: string) {
  const router = useTransitionRouter();

  // Ajouter une classe au body pour désactiver temporairement les interactions
  // Add a class to the body to temporarily disable interactions
  document.body.classList.add('transitioning');

  // Créer et afficher l'overlay AVANT de naviguer
  // Create and show the overlay BEFORE navigating
  const transitionPromise = portalTransition();

  // Attendre que l'overlay soit visible avant de naviguer
  // Wait for the overlay to be visible before navigating
  await transitionPromise;

  // Maintenant naviguer vers la nouvelle page
  // Now navigate to the new page
  router.push(url);
}
