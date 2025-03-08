'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@/styles/word-scroller-test.css';

export default function WordScrollerTest() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Configuration
    const config = {
      animate: true,
      snap: true,
      start: Math.floor(Math.random() * 100),
      end: Math.floor(Math.random() * 100) + 900,
      scroll: true,
      debug: false,
    };

    // Apply attributes to document root
    const root = document.documentElement;
    root.dataset.syncScrollbar = config.scroll.toString();
    root.dataset.animate = config.animate.toString();
    root.dataset.snap = config.snap.toString();
    root.dataset.debug = config.debug.toString();
    root.style.setProperty('--start', config.start.toString());
    root.style.setProperty('--hue', config.start.toString());
    root.style.setProperty('--end', config.end.toString());
    root.style.setProperty('--lightness', '65%');
    root.style.setProperty('--base-chroma', '0.3');

    // GSAP animations
    let items: HTMLElement[] = [];
    let scrollerScrub: ScrollTrigger | null = null;
    let dimmerScrub: ScrollTrigger | null = null;
    let chromaEntry: gsap.core.Tween | null = null;
    let chromaExit: gsap.core.Tween | null = null;

    // Wait for DOM to be ready
    setTimeout(() => {
      items = gsap.utils.toArray<HTMLElement>('ul li');

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
        root,
        {
          '--hue': config.start,
        },
        {
          '--hue': config.end,
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

      // Chroma animations for scrollbar
      chromaEntry = gsap.fromTo(
        root,
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

      chromaExit = gsap.fromTo(
        root,
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
    }, 100);

    // Cleanup function
    return () => {
      // Clean up GSAP animations
      if (scrollerScrub) scrollerScrub.kill();
      if (dimmerScrub) dimmerScrub.kill();
      if (chromaEntry && chromaEntry.scrollTrigger) chromaEntry.scrollTrigger.kill();
      if (chromaExit && chromaExit.scrollTrigger) chromaExit.scrollTrigger.kill();

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
  }, []);

  return (
    <div className="flex flex-col">
      <header>
        <h1 className="fluid">
          you can
          <br />
          scroll.
        </h1>
      </header>
      <main>
        <section className="content fluid">
          <h2>
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="sr-only">you can ship things.</span>
          </h2>
          <ul aria-hidden="true" style={{ '--count': 22 } as React.CSSProperties}>
            <li style={{ '--i': 0 } as React.CSSProperties}>design.</li>
            <li style={{ '--i': 1 } as React.CSSProperties}>prototype.</li>
            <li style={{ '--i': 2 } as React.CSSProperties}>solve.</li>
            <li style={{ '--i': 3 } as React.CSSProperties}>build.</li>
            <li style={{ '--i': 4 } as React.CSSProperties}>develop.</li>
            <li style={{ '--i': 5 } as React.CSSProperties}>debug.</li>
            <li style={{ '--i': 6 } as React.CSSProperties}>learn.</li>
            <li style={{ '--i': 7 } as React.CSSProperties}>cook.</li>
            <li style={{ '--i': 8 } as React.CSSProperties}>ship.</li>
            <li style={{ '--i': 9 } as React.CSSProperties}>prompt.</li>
            <li style={{ '--i': 10 } as React.CSSProperties}>collaborate.</li>
            <li style={{ '--i': 11 } as React.CSSProperties}>create.</li>
            <li style={{ '--i': 12 } as React.CSSProperties}>inspire.</li>
            <li style={{ '--i': 13 } as React.CSSProperties}>follow.</li>
            <li style={{ '--i': 14 } as React.CSSProperties}>innovate.</li>
            <li style={{ '--i': 15 } as React.CSSProperties}>test.</li>
            <li style={{ '--i': 16 } as React.CSSProperties}>optimize.</li>
            <li style={{ '--i': 17 } as React.CSSProperties}>teach.</li>
            <li style={{ '--i': 18 } as React.CSSProperties}>visualize.</li>
            <li style={{ '--i': 19 } as React.CSSProperties}>transform.</li>
            <li style={{ '--i': 20 } as React.CSSProperties}>scale.</li>
            <li style={{ '--i': 21 } as React.CSSProperties}>do it.</li>
          </ul>
        </section>
        <section>
          <h2 className="fluid">fin.</h2>
        </section>
      </main>
      <footer>ʕ⊙ᴥ⊙ʔ jh3yy &copy; 2024</footer>
    </div>
  );
}
