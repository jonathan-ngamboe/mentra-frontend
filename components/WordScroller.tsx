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
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { navigateWithTransition } = useTransitionNavigation();

  // Ensure words is always an array
  const wordsArray = Array.isArray(words) ? words : [];

  // Normalize words to handle both string[] and WordItem[]
  const normalizedWords: WordItem[] = wordsArray.map((item) =>
    typeof item === 'string' ? { text: item, link: '#' } : item
  );

  // Get the text of the last word for accessibility
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
    document.documentElement.dataset.touchDevice = isTouchDevice ? 'true' : 'false';

    // Set up CSS variables and data attributes
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

    // Cleanup variables for animations
    let scrollerScrub: ScrollTrigger | null = null;
    let dimmerScrub: ScrollTrigger | null = null;
    let chromaEntry: gsap.core.Tween | null = null;
    let chromaExit: gsap.core.Tween | null = null;

    // Determine active word based on scroll position
    const updateActiveWord = () => {
      if (!mainRef.current) return;

      const items = itemsRef.current.filter(Boolean);
      if (items.length === 0) return;

      let closestIndex = 0;
      let closestDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    // Handle scroll behavior for last item
    const handleLastItemVisibility = () => {
      if (!mainRef.current) return;

      const items = itemsRef.current.filter(Boolean);
      if (items.length === 0) return;

      // Only apply when last item is active
      if (activeIndex !== items.length - 1) return;

      const lastItem = items[items.length - 1];
      if (!lastItem) return;

      const lastRect = lastItem.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only scroll back up if we're significantly past the last item
      if (lastRect.bottom < viewportHeight / 2 - lastRect.height) {
        lastItem.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };

    // Create unified scroll handler with debounce
    const handleScroll = () => {
      updateActiveWord();

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Setup debounced scroll end detection
      scrollTimeoutRef.current = setTimeout(() => {
        handleLastItemVisibility();
      }, 200);
    };

    // If CSS scroll animations not supported, use GSAP
    if (!hasScrollAnimations) {
      const items = itemsRef.current.filter(Boolean);

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
    }

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Special handling for touch devices
    if (isTouchDevice) {
      // Add touchend for better mobile UX
      window.addEventListener(
        'touchend',
        () => {
          // Give time for inertial scrolling to settle
          setTimeout(updateActiveWord, 100);
        },
        { passive: true }
      );
    }

    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (isTouchDevice) {
        window.removeEventListener('touchend', updateActiveWord);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (scrollerScrub) scrollerScrub.kill();
      if (dimmerScrub) dimmerScrub.kill();
      if (chromaEntry && chromaEntry.scrollTrigger) chromaEntry.scrollTrigger.kill();
      if (chromaExit && chromaExit.scrollTrigger) chromaExit.scrollTrigger.kill();
    };
  }, [animate, debug, endHue, showScrollbar, snap, startHue, activeIndex]);

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
