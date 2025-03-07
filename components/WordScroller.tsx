'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { WordScrollerProps } from '@/types/WordScroller';
import { ServiceItem } from '@/types/service';
import { useTransitionNavigation } from '@/components/transitions/useTransitionNavigation';
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
  endWord = '',
  title = '',
  description = '',
  action = '',
}: WordScrollerProps) {
  const [mounted, setMounted] = useState(false);
  const listItemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const { navigateWithTransition } = useTransitionNavigation();
  const [activeWord, setActiveWord] = useState(0);

  // Normalize words
  const wordsArray = Array.isArray(words) ? words : [];
  const normalizedWords: ServiceItem[] = wordsArray.map((item) =>
    typeof item === 'string' ? { text: item, link: '#' } : item
  );

  // Handle click on a word
  const handleWordClick = (index: number, link: string) => {
    if (link && link !== '#' && activeWord === index) {
      navigateWithTransition(link);
    } else {
      setActiveWord(index);
      listItemsRef.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  // Ensure listItemsRef has enough slots for all words
  useEffect(() => {
    listItemsRef.current = listItemsRef.current.slice(0, normalizedWords.length);
    while (listItemsRef.current.length < normalizedWords.length) {
      listItemsRef.current.push(null);
    }
  }, [normalizedWords.length]);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Set up config
    const root = document.documentElement;
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
    }

    // Cleanup function
    return () => {
      // Clean up GSAP animations
      if (scrollerScrub) scrollerScrub.kill();
      if (dimmerScrub) dimmerScrub.kill();
      if (chromaEntry?.scrollTrigger) chromaEntry.scrollTrigger.kill();
      if (chromaExit?.scrollTrigger) chromaExit.scrollTrigger.kill();

      // Remove attributes from document root
      delete root.dataset.syncScrollbar;
      delete root.dataset.animate;
      delete root.dataset.snap;
      delete root.dataset.debug;
      root.style.removeProperty('--start');
      root.style.removeProperty('--hue');
      root.style.removeProperty('--end');
      root.style.removeProperty('--lightness');
      root.style.removeProperty('--base-chroma');
    };
  }, [animate, debug, endHue, showScrollbar, snap, startHue]);

  if (!mounted) return null;

  return (
    <div className={`word-scroller ${className}`}>
      <header className="min-h-screen flex w-full place-items-center relative justify-center">
        <div className="max-w-4xl px-4 md:px-8 text-center">
          <h1 className="block text-sm md:text-base uppercase tracking-widest text-foreground/60 mb-4 font-medium">
            {title}
          </h1>

          <div className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gradient">
            <span className="relative inline-block">
              <h2 className="relative">{description}</h2>
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary transform -skew-x-12"></span>
            </span>
          </div>

          <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            {action}
          </p>
        </div>

        <div className="absolute bottom-20 md:bottom-8 left-0 right-0 mx-auto w-10 h-10 flex items-center justify-center rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce opacity-60"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </header>
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
              ref={(el) => {
                listItemsRef.current[index] = el;
              }}
              style={{ '--i': index } as React.CSSProperties}
              className={index === normalizedWords.length - 1 ? 'last-word' : ''}
              onClick={() => handleWordClick(index, word.link || '#')}
              title={word.link && word.link !== '#' ? `Go to ${word.text}` : undefined}
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
