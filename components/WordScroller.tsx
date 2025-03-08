'use client';

import React, { useEffect, useState } from 'react';
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
  showScrollbar = false,
  debug = true,
  className = '',
  endWord = '',
}: WordScrollerProps) {
  const [mounted, setMounted] = useState(false);

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

    // Set up config
    const root = document.documentElement;

    // Save original values to restore later
    const originalSnap = root.dataset.snap;
    const originalAnimate = root.dataset.animate;
    const originalSyncScrollbar = root.dataset.syncScrollbar;
    const originalDebug = root.dataset.debug;
    const originalHue = root.style.getPropertyValue('--hue');
    const originalStart = root.style.getPropertyValue('--start');
    const originalEnd = root.style.getPropertyValue('--end');

    // Apply new values
    root.dataset.syncScrollbar = showScrollbar.toString();
    root.dataset.animate = animate.toString();
    root.dataset.snap = snap.toString();
    root.dataset.debug = debug.toString();
    root.style.setProperty('--start', startHue.toString());
    root.style.setProperty('--hue', startHue.toString());
    root.style.setProperty('--end', endHue.toString());
    root.style.setProperty('--lightness', '65%');
    root.style.setProperty('--base-chroma', '0.3');

    // Variables for GSAP
    let items: HTMLElement[] = [];
    let scrollerScrub: ScrollTrigger | null = null;
    let dimmerScrub: ScrollTrigger | null = null;
    let chromaEntry: gsap.core.Tween | null = null;
    let chromaExit: gsap.core.Tween | null = null;

    // Use GSAP if CSS scroll animations not supported
    if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
      // IMPORTANT: Select elements after they are rendered
      setTimeout(() => {
        items = gsap.utils.toArray<HTMLElement>('.word-scroller section:first-of-type ul li');

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
          document.documentElement,
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

        // Create animation for chroma entry
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

        // Create animation for chroma exit
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

        // Disable animations if not enabled
        if (!animate) {
          if (chromaEntry?.scrollTrigger) chromaEntry.scrollTrigger.disable(true, false);
          if (chromaExit?.scrollTrigger) chromaExit.scrollTrigger.disable(true, false);
          if (dimmerScrub) dimmerScrub.disable(true, false);
          if (scrollerScrub) scrollerScrub.disable(true, false);
          gsap.set(items, { opacity: 1 });
          gsap.set(document.documentElement, { '--chroma': 0 });
        }
      }, 100);
    }

    // Cleanup function
    return () => {
      // Restoring original values
      if (originalSnap !== undefined) root.dataset.snap = originalSnap;
      else delete root.dataset.snap;

      if (originalAnimate !== undefined) root.dataset.animate = originalAnimate;
      else delete root.dataset.animate;

      if (originalSyncScrollbar !== undefined) root.dataset.syncScrollbar = originalSyncScrollbar;
      else delete root.dataset.syncScrollbar;

      if (originalDebug !== undefined) root.dataset.debug = originalDebug;
      else delete root.dataset.debug;

      if (originalHue) root.style.setProperty('--hue', originalHue);
      else root.style.removeProperty('--hue');

      if (originalStart) root.style.setProperty('--start', originalStart);
      else root.style.removeProperty('--start');

      if (originalEnd) root.style.setProperty('--end', originalEnd);
      else root.style.removeProperty('--end');

      // Clean up GSAP animations
      if (scrollerScrub) scrollerScrub.kill();
      if (dimmerScrub) dimmerScrub.kill();
      if (chromaEntry?.scrollTrigger) chromaEntry.scrollTrigger.kill();
      if (chromaExit?.scrollTrigger) chromaExit.scrollTrigger.kill();
    };
  }, [animate, debug, endHue, showScrollbar, snap, startHue]);

  if (!mounted) return null;

  return (
    <div className={`word-scroller ${className}`}>
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
      <section>
        <h2 className="fluid">{endWord}</h2>
      </section>
    </div>
  );
}
