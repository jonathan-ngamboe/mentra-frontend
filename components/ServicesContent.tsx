'use client';

import WordScroller from '@/components/WordScroller';
import MobileServiceScroller from '@/components/MobileServiceScroller';
import { Dictionary } from '@/types/dictionary';
import { ServiceItem } from '@/types/service';
import { useIsMobile } from '@/hooks/useIsMobile';

type ServicesContentProps = {
  dictionary: Dictionary;
  serviceItems: ServiceItem[];
};

export default function ServicesContent({ dictionary, serviceItems }: ServicesContentProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <MobileServiceScroller
          title={dictionary.services.title}
          description={dictionary.services.description}
          prefix={dictionary.services.prefix}
          services={serviceItems}
          cta={dictionary.common.clickToKnowMore}
          excludeLabelKeys={['services.doIt.action']}
        />
      ) : (
        <WordScroller
          title={dictionary.services.title}
          description={dictionary.services.description}
          action={dictionary.services.action}
          prefix={dictionary.services.prefix}
          words={serviceItems}
          endWord={dictionary.services.end}
        />
      )}
    </>
  );
}
