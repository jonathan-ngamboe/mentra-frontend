'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { useTransitionNavigation } from '@/components/transitions/useTransitionNavigation';
import { WordScrollerProps, WordItem } from '@/types/WordScroller';
import styles from '@/styles/WordScroller.module.css';
import '@/styles/WordScroller.css';

export default function WordScroller({
  prefix = 'you can',
  words = [],
  animate = true,
  snap = false,
  startHue = Math.floor(Math.random() * 100),
  endHue = Math.floor(Math.random() * 100) + 900,
  showScrollbar = true,
  debug = false,
  className = '',
  endWord = '',
}: WordScrollerProps) {
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { navigateWithTransition } = useTransitionNavigation();

  // Normalize words
  const wordsArray = Array.isArray(words) ? words : [];
  const normalizedWords: WordItem[] = wordsArray.map((item) =>
    typeof item === 'string' ? { text: item, link: '#' } : item
  );

  // Handle word click - either scroll to it or navigate to link
  const handleWordClick = (index: number, link: string) => {
    if (link !== '' && index === activeIndex) {
      // If a link is set, navigate to that link
      navigateWithTransition(link);
    } else {
      // Otherwise, update active index without forcing scroll
      setActiveIndex(index);
      // smooth scroll without disrupting snap scroll
      const element = itemsRef.current[index];
      if (element) {
        // Use requestAnimationFrame to avoid conflicts
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        });
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Set up config
    const root = document.documentElement;
    root.dataset.syncScrollbar = showScrollbar.toString();
    root.dataset.animate = animate.toString();
    root.dataset.debug = debug.toString();
    root.style.setProperty('--start', startHue.toString());
    root.style.setProperty('--hue', startHue.toString());
    root.style.setProperty('--end', endHue.toString());

    // Variables for GSAP
    let items: HTMLElement[] = [];
    let scrollerScrub: ScrollTrigger | null = null;
    let dimmerScrub: ScrollTrigger | null = null;
    let chromaEntry: gsap.core.Tween | null = null;
    let chromaExit: gsap.core.Tween | null = null;

    const container = document.querySelector(`.${styles.wordScroller}`) as HTMLElement; 
    if (container) {
      container.classList.add('wordScrollerContainer');
      container.dataset.snap = snap.toString();
    }

    // Use GSAP if CSS scroll animations not supported
    if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
      const wordScrollerElement = document.querySelector(`.${styles.wordScroller}`);
      if (wordScrollerElement) {
        items = gsap.utils.toArray<HTMLElement>(`.${styles.wordScroller} ul li`);

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
      }
    }

    // Cleanup function
    return () => {
      if (scrollerScrub) scrollerScrub.kill();
      if (dimmerScrub) dimmerScrub.kill();
      if (chromaEntry?.scrollTrigger) chromaEntry.scrollTrigger.kill();
      if (chromaExit?.scrollTrigger) chromaExit.scrollTrigger.kill();
    };
  }, [animate, debug, endHue, showScrollbar, snap, startHue]);

  if (!mounted) return null;

  return (
    <main className={`${styles.wordScroller} ${className}`}>
      <section className={styles.fluid}>
        <h2>
          <span aria-hidden="true">{prefix}&nbsp;</span>
        </h2>
        <ul aria-hidden="true" style={{ '--count': normalizedWords.length } as React.CSSProperties}>
          {normalizedWords.map((word, index) => (
            <li
              key={index}
              ref={(el) => {
                if (el) itemsRef.current[index] = el;
              }}
              style={{ '--i': index, cursor: 'pointer' } as React.CSSProperties}
              className={`${index === normalizedWords.length - 1 ? styles.lastWord : ''} relative`}
              onClick={() => handleWordClick(index, word.link)}
            >
              {word.text}.
              {word.badge && (
                <Badge variant="destructive" className={styles.comingSoonBadge}>
                  {word.badge}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className={styles.fluid}>{endWord}</h2>
      </section>
    </main>
  );
}
