'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTransitionNavigation } from '@/components/transitions';
import { Badge } from '@/components/ui/badge';
import { WordScrollerProps, WordItem } from '@/types/WordScroller';

import '@/styles/WordScroller.css';

export default function WordScroller({
  prefix = 'you can',
  words = [],
  animate = true,
  snap = true,
  startHue = Math.floor(Math.random() * 100),
  endHue = Math.floor(Math.random() * 100) + 900,
  showScrollbar = true,
  debug = false,
  className = '',
}: WordScrollerProps) {
  const mainRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { navigateWithTransition } = useTransitionNavigation();

  // Ensure words is always an array (defensive programming)
  const wordsArray = Array.isArray(words) ? words : [];

  // Normalize words to handle both string[] and WordItem[]
  const normalizedWords: WordItem[] = wordsArray.map((item) =>
    typeof item === 'string' ? { text: item, link: '#' } : item
  );

  // Get the text of the last word for accessibility - with null checking
  const lastWordText =
    normalizedWords.length > 0 ? normalizedWords[normalizedWords.length - 1]?.text || '' : '';

  // Handle word click - either scroll to it or navigate to link
  const handleWordClick = (index: number, link: string) => {
    if (index === activeIndex && link !== '') {
      // If already active, navigate to link
      navigateWithTransition(link);
    } else {
      // Otherwise scroll to the word
      const element = itemsRef.current[index];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Check if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      document.documentElement.dataset.touchDevice = 'true';
    }

    // Set up animations
    let items: HTMLLIElement[] = [];
    let scrollerScrub: ScrollTrigger | null = null;
    let dimmerScrub: ScrollTrigger | null = null;
    let chromaEntry: gsap.core.Tween | null = null;
    let chromaExit: gsap.core.Tween | null = null;

    const updateDOM = () => {
      if (!mainRef.current) return;
      const root = document.documentElement;

      // Apply data attributes and CSS variables
      root.dataset.syncScrollbar = showScrollbar.toString();
      root.dataset.animate = animate.toString();
      root.dataset.snap = snap.toString();
      root.dataset.debug = debug.toString();

      root.style.setProperty('--start', startHue.toString());
      root.style.setProperty('--hue', startHue.toString());
      root.style.setProperty('--end', endHue.toString());
    };

    updateDOM();

    // Check if CSS scroll-driven animations are supported
    const hasScrollAnimations = CSS.supports(
      '(animation-timeline: scroll()) and (animation-range: 0% 100%)'
    );

    // If not supported or explicitly disabled, use GSAP
    if (!hasScrollAnimations) {
      // Get all list items
      items = itemsRef.current.filter(Boolean);

      if (items.length > 0) {
        // Set initial opacity states - first item visible, others dimmed
        gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

        // Create timeline for opacity changes
        const dimmer = gsap
          .timeline()
          .to(items.slice(1), {
            opacity: 1,
            stagger: 0.5,
          })
          .to(
            items.slice(0, items.length - 1),
            {
              opacity: 0.2,
              stagger: 0.5,
            },
            0
          );

        // Create ScrollTrigger for opacity animation
        dimmerScrub = ScrollTrigger.create({
          trigger: items[0],
          endTrigger: items[items.length - 1],
          start: 'center center',
          end: 'center center',
          animation: dimmer,
          scrub: 0.2,
          onUpdate: (self) => {
            // Update active index based on progress
            const progress = self.progress;
            const totalItems = items.length;
            const newIndex = Math.min(Math.floor(progress * totalItems), totalItems - 1);
            setActiveIndex(newIndex);
          },
        });

        // Create timeline for scrollbar color change
        const scroller = gsap.timeline().fromTo(
          document.documentElement,
          {
            '--hue': startHue,
          },
          {
            '--hue': endHue,
            ease: 'none',
          }
        );

        // Create ScrollTrigger for scrollbar color animation
        scrollerScrub = ScrollTrigger.create({
          trigger: items[0],
          endTrigger: items[items.length - 1],
          start: 'center center',
          end: 'center center',
          animation: scroller,
          scrub: 0.2,
        });

        // Create animation for chroma entry effect
        chromaEntry = gsap.fromTo(
          document.documentElement,
          {
            '--chroma': 0,
          },
          {
            '--chroma': 0.3,
            ease: 'none',
            scrollTrigger: {
              scrub: 0.2,
              trigger: items[0],
              start: 'center center+=40',
              end: 'center center',
            },
          }
        );

        // Create animation for chroma exit effect
        chromaExit = gsap.fromTo(
          document.documentElement,
          {
            '--chroma': 0.3,
          },
          {
            '--chroma': 0,
            ease: 'none',
            scrollTrigger: {
              scrub: 0.2,
              trigger: items[items.length - 2],
              start: 'center center',
              end: 'center center-=40',
            },
          }
        );

        // Handle animation toggling
        if (!animate) {
          chromaEntry.scrollTrigger?.disable(true, false);
          chromaExit.scrollTrigger?.disable(true, false);
          dimmerScrub.disable(true, false);
          scrollerScrub.disable(true, false);
          gsap.set(items, { opacity: 1 });
          gsap.set(document.documentElement, { '--chroma': 0 });
        }
      }
    } else {
      // For scroll-driven animations, add scroll event listener to track active index
      const handleScroll = () => {
        if (!mainRef.current) return;

        const items = itemsRef.current.filter(Boolean);
        let closestIndex = 0;
        let closestDistance = Infinity;

        const centerOffset = isTouchDevice ? 0 : 0;

        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.top + rect.height / 2;
          const targetPosition = window.innerHeight / 2 + centerOffset;
          const distance = Math.abs(itemCenter - targetPosition);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveIndex(closestIndex);
      };

      let isScrolling = false;
      let scrollTimeout: ReturnType<typeof setTimeout>;

      const handleLastItemVisibility = () => {
        if (!mainRef.current) return;

        const items = itemsRef.current.filter(Boolean);
        if (items.length === 0) return;

        if (activeIndex !== items.length - 1) return;

        const lastItem = items[items.length - 1];
        if (!lastItem) return;

        const lastRect = lastItem.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const threshold = lastRect.height * 1.5; 

        if (lastRect.bottom < viewportHeight / 2 - threshold) {
          lastItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      };

      window.addEventListener('scroll', () => {
        handleScroll();

        clearTimeout(scrollTimeout);
        isScrolling = true;

        scrollTimeout = setTimeout(() => {
          isScrolling = false;
          handleLastItemVisibility();
        }, 150);
      });

      if (isTouchDevice) {
        const handleTouchEnd = () => {
          // Delay longer to let inertia finish
          setTimeout(handleScroll, 250);
        };

        window.addEventListener('touchend', handleTouchEnd);

        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('touchend', handleTouchEnd);
        };
      }

      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (isTouchDevice) window.removeEventListener('touchend', handleScroll);
      };
    }

    // Return cleanup function
    return () => {
      if (scrollerScrub) scrollerScrub.kill();
      if (dimmerScrub) dimmerScrub.kill();
      if (chromaEntry && chromaEntry.scrollTrigger) chromaEntry.scrollTrigger.kill();
      if (chromaExit && chromaExit.scrollTrigger) chromaExit.scrollTrigger.kill();
    };
  }, [animate, debug, endHue, showScrollbar, snap, startHue, words]);

  // Don't render until client-side to prevent hydration issues
  if (!mounted) return null;

  return (
    <main ref={mainRef} className={`word-scroller ${className}`}>
      <section className="content fluid justify-center">
        <h2>
          <span aria-hidden="true" className="text-foreground">
            {prefix}&nbsp;
          </span>
          <span className="sr-only">
            {prefix} {lastWordText}.
          </span>
        </h2>
        <ul aria-hidden="true" style={{ '--count': normalizedWords.length } as React.CSSProperties}>
          {normalizedWords.map((word, index) => (
            <li
              key={index}
              style={{ '--i': index } as React.CSSProperties}
              ref={(el) => {
                if (el) itemsRef.current[index] = el;
              }}
              className={`word-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleWordClick(index, word.link)}
            >
              {word.text}.
              {word.badge && (
                <Badge variant="destructive" className="coming-soon-badge">
                  {word.badge}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
