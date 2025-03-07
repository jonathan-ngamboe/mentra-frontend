import { getDictionary, SupportedLocale } from '../dictionaries';
import { services } from '@/resources/config';
import WordScroller from '@/components/WordScroller';
import { getDictionaryValue } from '@/lib/utils';
import { Suspense } from 'react';

export default async function Services({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  function getServiceItems() {
    return services.map((service) => ({
      text:
        getDictionaryValue(dict, service.labelKey).toLowerCase() || service.labelKey.toLowerCase(),
      link: service.link,
      badge: getDictionaryValue(dict, service.badge || '') || service.badge,
    }));
  }

  return (
    <div className="container mx-auto self-center">
      <div className="flex flex-col mx-auto">
        <header className="relative flex flex-col items-center justify-center h-[100svh] overflow-hidden snap-start" id="header-section">
          <div className="absolute inset-0 bg-gradient-radial from-background/5 to-background/80 z-0"></div>

          <div className="relative z-10 max-w-4xl px-4 md:px-8 text-center">
            <span className="block text-sm md:text-base uppercase tracking-widest text-foreground/60 mb-4 font-medium">
              {dict.services.title}
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="relative inline-block">
                <span className="relative z-10">{dict.services.description}</span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary transform -skew-x-12"></span>
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              {dict.services.action}
            </p>
          </div>

          <a 
            href="#word-scroller-section" 
            className="absolute bottom-8 left-0 right-0 mx-auto w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
            aria-label="Scroll down"
          >
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
          </a>

          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full blur-3xl"></div>
        </header>

        <div id="word-scroller-section" className="scroll-mt-4 snap-start">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                {dict.common.loading}...
              </div>
            }
          >
            <WordScroller prefix={dict.services.prefix} words={getServiceItems()} />
          </Suspense>
        </div>

        <section className="flex items-center justify-center min-h-screen snap-start">
          <h2 className="text-6xl font-bold">{dict.services.end}.</h2>
        </section>
      </div>
    </div>
  );
}