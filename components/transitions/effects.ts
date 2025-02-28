import lottie, { AnimationItem } from 'lottie-web';

/**
 * Create a smooth transition with crystal blur effect and animated loader
 * @returns A promise that resolves when the overlay is ready
 */
export function portalTransition() {
  return new Promise<void>((resolve) => {
    const computedStyle = window.getComputedStyle(document.documentElement);
    const colorScheme = computedStyle.getPropertyValue('color-scheme').trim();
    const isDarkTheme = colorScheme.includes('dark');

    console.log(isDarkTheme);
    // Create a transition overlay
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'transition-overlay';
    document.body.appendChild(transitionOverlay);

    // Create a container for the animation
    const animationContainer = document.createElement('div');
    animationContainer.className = 'animation-container';
    animationContainer.style.width = 'min(220px, 25vw)';
    animationContainer.style.height = 'min(220px, 50vw)';
    animationContainer.style.opacity = '0';
    animationContainer.style.transform = 'scale(0.85)';
    transitionOverlay.appendChild(animationContainer);

    // Init lottie animation
    let animation: AnimationItem | null = null;
    if (typeof lottie !== 'undefined') {
      animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `/loading-hand-${isDarkTheme ? 'dark' : 'light'}.json`,
      });
    } else {
      // Fallback if Lottie is not available - use a simple SVG animation
      animationContainer.innerHTML = `
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="30" fill="none" stroke="white" stroke-width="4">
            <animate attributeName="r" from="30" to="40" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="60" r="20" fill="white">
            <animate attributeName="r" from="15" to="20" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      `;
    }

    // Force reflow
    void transitionOverlay.offsetWidth;

    // Activate overlay with animation
    transitionOverlay.classList.add('active');

    // Animate in the loader with a slight delay
    setTimeout(() => {
      animationContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      animationContainer.style.opacity = '1';
      animationContainer.style.transform = 'scale(1)';
    }, 200);

    // Resolving the promise to allow navigation
    setTimeout(() => {
      resolve();

      // Once the new page is loaded
      setTimeout(() => {
        // First fade out the loader
        animationContainer.style.opacity = '0';
        animationContainer.style.transform = 'scale(1.15)';

        // Then fade out the overlay after a short delay
        setTimeout(() => {
          const exitAnimation = transitionOverlay.animate(
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
          );

          exitAnimation.onfinish = () => {
            if (animation && typeof animation.destroy === 'function') {
              animation.destroy();
            }
            transitionOverlay.remove();
            document.body.classList.remove('transitioning');
          };
        }, 250);
      }, 500);
    }, 2000);
  });
}

/**
 * Create a smooth fullscreen color transition with Lottie loader
 * @param {string} primaryColor - The primary color to use (default: current theme accent)
 * @returns A promise that resolves when the transition is ready for navigation
 */
export function catTransition(primaryColor?: string) {
  return new Promise<void>((resolve) => {
    // Use provided color or get theme accent color
    const transitionColor = primaryColor || '#f0e404';

    // Create main transition container
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'page-transition-container';
    transitionContainer.style.setProperty('--transition-color', transitionColor);
    document.body.appendChild(transitionContainer);

    // Create the Lottie loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'transition-loader-container';
    transitionContainer.appendChild(loaderContainer);

    // Timing constants based on Lottie animation (40fps)
    const LOTTIE_FPS = 40;
    const TO_BLACK_FRAME = 36;  // Exact frame of transition to black
    const ANIMATION_END_FRAME = 112; // Exact frame of animation end

    // Convert frames to milliseconds
    const TO_BLACK_MS = (TO_BLACK_FRAME / LOTTIE_FPS) * 1000; // = 900ms
    const BLACK_DURATION_MS = ((ANIMATION_END_FRAME - TO_BLACK_FRAME) / LOTTIE_FPS) * 1000; // = 1900ms

    // Initialize Lottie animation
    let animation: AnimationItem | null = null;

    if (typeof lottie !== 'undefined') {
      animation = lottie.loadAnimation({
        container: loaderContainer,
        renderer: 'svg',
        loop: false, // Important: to false to avoid repeating
        autoplay: true,
        path: '/loading-cat.json',
      });
    } else {
      // Fallback if Lottie is not available
      loaderContainer.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="30" fill="none" stroke="white" stroke-width="3">
            <animate attributeName="r" from="30" to="35" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="40" r="15" fill="white">
            <animate attributeName="r" from="12" to="15" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      `;
    }

    // Force reflow
    void transitionContainer.offsetWidth;

    // PHASE 1: Initial color fill
    transitionContainer.classList.add('phase-one');

    // Resolve to allow navigation right before black screen
    setTimeout(() => {
      transitionContainer.classList.add('phase-two');

      // IMPORTANT: Resolve the promise to allow navigation
      resolve();
      
      setTimeout(() => {
        transitionContainer.classList.add('phase-four');
        
        // Clean up 
        setTimeout(() => {
          if (animation && typeof animation.destroy === 'function') {
            animation.destroy();
          }
          transitionContainer.remove();
          document.body.classList.remove('page-transitioning');
        }, 800);
      }, BLACK_DURATION_MS); 
    }, TO_BLACK_MS); 
  });
}
