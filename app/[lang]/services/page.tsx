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
        <header
          className="relative flex flex-col items-center justify-center h-[100svh] overflow-hidden snap-start"
          id="header-section"
        >
          <div className="relative max-w-4xl px-4 md:px-8 text-center">
            <h1 className="block text-sm md:text-base uppercase tracking-widest text-foreground/60 mb-4 font-medium">
              {dict.services.title}
            </h1>

            <div className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gradient">
              <span className="relative inline-block">
                <h2 className="relative">{dict.services.description}</h2>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary transform -skew-x-12"></span>
              </span>
            </div>

            <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              {dict.services.action}
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

        <div className="scroll-mt-4 snap-start">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                {dict.common.loading}...
              </div>
            }
          >
            <WordScroller
              prefix={dict.services.prefix}
              words={getServiceItems()}
              endWord={dict.services.end}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
