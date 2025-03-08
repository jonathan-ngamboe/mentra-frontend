'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { WordScrollerProps, WordItem } from '@/types/WordScroller';
import '@/styles/WordScroller.css';

export default function WordScroller({
  prefix = 'you can',
  words = [],
  animate = false,
  snap = false,
  startHue = Math.floor(Math.random() * 100),
  endHue = Math.floor(Math.random() * 100) + 900,
  showScrollbar = true,
  debug = true, 
  className = '',
  endWord = '',
}: WordScrollerProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize words
  const wordsArray = Array.isArray(words) ? words : [];
  const normalizedWords: WordItem[] = wordsArray.map((item) =>
    typeof item === 'string' ? { text: item, link: '#' } : item
  );

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    container.dataset.syncScrollbar = showScrollbar.toString();
    container.dataset.animate = animate.toString();
    container.dataset.snap = snap.toString();
    container.dataset.debug = debug.toString();
    container.style.setProperty('--start', startHue.toString());
    container.style.setProperty('--hue', startHue.toString());
    container.style.setProperty('--end', endHue.toString());
    container.style.setProperty('--lightness', '65%');
    container.style.setProperty('--base-chroma', '0.3');

    // Variables for GSAP
    let items: HTMLElement[] = [];
    let scrollerScrub: ScrollTrigger | null = null;
    let dimmerScrub: ScrollTrigger | null = null;

    // Use GSAP if animations are enabled
    if (animate) {
      setTimeout(() => {
        items = gsap.utils.toArray<HTMLElement>(`#word-scroller-${startHue} li`);

        if (items.length === 0) {
          console.error('No items found for GSAP animations');
          return;
        }

        // Set initial opacity
        gsap.set(items, { opacity: (i: number) => (i !== 0 ? 0.2 : 1) });

        // Create opacity timeline
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

        // Create scroll trigger for opacity
        dimmerScrub = ScrollTrigger.create({
          trigger: items[0],
          endTrigger: items[items.length - 1],
          start: 'center center',
          end: 'center center',
          animation: dimmer,
          scrub: 0.2,
        });

        // Create scrollbar color timeline
        const scroller = gsap.timeline().fromTo(
          container,
          {
            '--hue': startHue,
          },
          {
            '--hue': endHue,
            ease: 'none',
          }
        );

        // Create scroll trigger for scrollbar color
        scrollerScrub = ScrollTrigger.create({
          trigger: items[0],
          endTrigger: items[items.length - 1],
          start: 'center center',
          end: 'center center',
          animation: scroller,
          scrub: 0.2,
        });
      }, 100);
    }

    // Cleanup function
    return () => {
      // Clean up GSAP animations
      if (scrollerScrub) scrollerScrub.kill();
      if (dimmerScrub) dimmerScrub.kill();
    };
  }, [animate, debug, endHue, showScrollbar, snap, startHue]);

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef} 
      className={`word-scroller ${className}`}
      id={`word-scroller-${startHue}`}
    >
      <section className="content fluid">
        <h2>
          <span aria-hidden="true">{prefix}&nbsp;</span>
          <span className="sr-only">
            {prefix} {normalizedWords[0]?.text}.
          </span>
        </h2>
        <ul aria-hidden="true" style={{ '--count': normalizedWords.length } as React.CSSProperties}>
          {normalizedWords.map((word, index) => (
            <li
              key={index}
              style={{ '--i': index } as React.CSSProperties}
              className={index === normalizedWords.length - 1 ? 'last-word' : ''}
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
      {endWord && (
        <section>
          <h2 className="fluid">{endWord}</h2>
        </section>
      )}
    </div>
  );
}