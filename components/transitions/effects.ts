import lottie, { AnimationItem } from 'lottie-web';
import { getRandomVibrantColor, hslToHex } from '@/lib/utils';

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
 * Create a smooth fullscreen color transition with ripple effect and Lottie loader
 * @param {string} corner - The corner to start the ripple from ('top-left', 'top-right', 'bottom-left', 'bottom-right')
 * @returns A promise that resolves when the transition is ready for navigation
 */
export function catTransition(corner: string = 'top-left') {
  return new Promise<void>((resolve) => {
    // Mark the body to prevent interactions during the transition
    document.body.classList.add('page-transitioning');

    // Generate a random vibrant color
    const randomColor = getRandomVibrantColor();

    // Create main transition container
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'page-transition-container';
    transitionContainer.style.setProperty('--transition-color', randomColor);
    document.body.appendChild(transitionContainer);

    // Create ripple wrapper
    const rippleWrapper = document.createElement('div');
    rippleWrapper.className = 'ripple-wrapper';
    transitionContainer.appendChild(rippleWrapper);

    // Create the ripple circle
    const rippleCircle = document.createElement('div');
    rippleCircle.className = 'ripple-circle';
    rippleWrapper.appendChild(rippleCircle);

    // Calculating the viewport dimensions
    const viewportWidth = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const viewportHeight = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    // Calculating the screen diagonal to ensure the circle covers everything
    const maxDimension =
      Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight) * 2;

    // Get the starting position of the circle based on the corner
    let startX, startY;

    switch (corner) {
      case 'top-right':
        startX = viewportWidth;
        startY = 0;
        break;
      case 'bottom-left':
        startX = 0;
        startY = viewportHeight;
        break;
      case 'bottom-right':
        startX = viewportWidth;
        startY = viewportHeight;
        break;
      case 'top-left':
      default:
        startX = 0;
        startY = 0;
    }

    // Place the circle at the starting point
    rippleCircle.style.left = `${startX}px`;
    rippleCircle.style.top = `${startY}px`;

    // Create the Lottie loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'transition-loader-container';
    transitionContainer.appendChild(loaderContainer);

    // Timing constants based on Lottie animation (40fps)
    const LOTTIE_FPS = 64;
    const ANIMATION_END_FRAME = 425; // Exact frame of animation end

    // Convert frames to milliseconds
    const TOTAL_DURATION_MS = (ANIMATION_END_FRAME / LOTTIE_FPS) * 1000; // = 2800ms

    // Delay before resolving the promise (allow navigation)
    const RESOLVE_MS = 800; // Ripple circle expansion duration

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

    // Force reflow to ensure styles are applied before animation
    void transitionContainer.offsetWidth;

    // Start the entry animation with requestAnimationFrame to ensure everything is ready
    requestAnimationFrame(() => {
      // Animate the circle to grow and cover the whole screen
      rippleCircle.style.transition =
        'width 0.8s cubic-bezier(0.65, 0, 0.35, 1), height 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
      rippleCircle.style.width = `${maxDimension}px`;
      rippleCircle.style.height = `${maxDimension}px`;

      // Activate the loader
      transitionContainer.classList.add('active');

      setTimeout(() => {
        // IMPORTANT: Resolve the promise to allow navigation
        resolve();

        // Start the exit animation after an appropriate delay
        setTimeout(
          () => {
            // Prepare the exit animation
            transitionContainer.classList.add('closing');

            // Animate the circle to shrink
            rippleCircle.style.transition =
              'width 0.8s cubic-bezier(0.65, 0, 0.35, 1), height 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
            rippleCircle.style.width = '0';
            rippleCircle.style.height = '0';

            // Clean up after the animation ends
            setTimeout(() => {
              if (animation && typeof animation.destroy === 'function') {
                animation.destroy();
              }
              transitionContainer.remove();
              document.body.classList.remove('page-transitioning');
            }, 800);
          },
          TOTAL_DURATION_MS - RESOLVE_MS - 800
        );
      }, RESOLVE_MS);
    });
  });
}
